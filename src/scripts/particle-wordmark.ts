import * as THREE from 'three';

const TEXT_A = 'holtsdav';
const TEXT_B = 'David Holtschke';
const FONT_STACK =
	'-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
const SAMPLE_WIDTH = 1400;
const SAMPLE_HEIGHT = 560;
const HOLD_DURATION_MS = 3500;
const MORPH_DURATION_MS = 1600;
const CYCLE_DURATION_MS = HOLD_DURATION_MS * 2 + MORPH_DURATION_MS * 2;
const RESIZE_REBUILD_DELAY_MS = 180;

const vertexShader = /* glsl */ `
	attribute vec3 aTargetA;
	attribute vec3 aTargetB;
	attribute float aColorGroup;
	attribute float aSeed;
	attribute float aSize;
	attribute float aFlow;

	uniform float uTime;
	uniform float uMorph;
	uniform float uCanvasWidth;
	uniform float uPixelRatio;
	uniform float uPointerStrength;
	uniform float uInteractionRadius;
	uniform float uMaxDisplacement;
	uniform vec2 uPointer;
	uniform vec2 uPointerVelocity;

	varying float vSeed;
	varying vec3 vColor;

	void main() {
		float stagger = (aSeed - 0.5) * 0.16;
		float localMorph = smoothstep(0.0, 1.0, clamp(uMorph + stagger, 0.0, 1.0));
		vec2 from = aTargetA.xy * uCanvasWidth;
		vec2 to = aTargetB.xy * uCanvasWidth;
		vec2 travel = to - from;
		float travelLength = length(travel);
		vec2 travelDirection = travelLength > 0.001
			? travel / travelLength
			: vec2(1.0, 0.0);
		vec2 travelNormal = vec2(-travelDirection.y, travelDirection.x);
		float transitionEnvelope = sin(localMorph * 3.14159265);
		float flowWave = sin(
			localMorph * 6.2831853 +
			aFlow * 6.2831853 +
			from.x * 0.012
		);
		vec2 transitionFlow =
			travelNormal * flowWave * min(18.0, 3.5 + travelLength * 0.075) *
			transitionEnvelope;
		transitionFlow += travelDirection *
			sin(localMorph * 3.14159265 + aFlow * 4.0) *
			2.5 * transitionEnvelope;
		vec2 base = mix(from, to, localMorph) + transitionFlow;

		float idlePhase = uTime * (0.11 + aSeed * 0.045) + aSeed * 6.2831853;
		vec2 idle = vec2(
			sin(idlePhase + base.y * 0.018),
			cos(idlePhase * 0.79 + base.x * 0.012)
		) * (0.025 + aSeed * 0.045);

		vec2 delta = base - uPointer;
		float distanceToPointer = length(delta);
		float safeDistance = max(distanceToPointer, 0.001);
		vec2 radialDirection = delta / safeDistance;
		if (distanceToPointer < 0.001) {
			float seedAngle = aSeed * 6.2831853;
			radialDirection = vec2(cos(seedAngle), sin(seedAngle));
		}

		vec2 tangent = vec2(-radialDirection.y, radialDirection.x);
		float velocityLength = length(uPointerVelocity);
		vec2 velocityDirection = velocityLength > 0.001
			? uPointerVelocity / velocityLength
			: vec2(1.0, 0.0);
		float velocityAmount = clamp(velocityLength / 900.0, 0.0, 1.0);
		float tangentSign = dot(tangent, velocityDirection) >= 0.0 ? 1.0 : -1.0;

		float normalizedDistance = distanceToPointer / max(uInteractionRadius, 1.0);
		float falloff = exp(-normalizedDistance * normalizedDistance * 3.0);
		float organicVariation = 0.88 + aSeed * 0.12;

		vec2 radialFlow =
			radialDirection * uMaxDisplacement * 0.35 * (0.54 + velocityAmount * 0.18);
		vec2 tangentialFlow =
			tangent * tangentSign * uMaxDisplacement * 0.45 *
			(0.32 + velocityAmount * 0.68);
		float wakeMask = 0.45 + 0.55 * max(dot(-radialDirection, velocityDirection), 0.0);
		vec2 wake =
			velocityDirection * uMaxDisplacement * 0.20 * velocityAmount * wakeMask;

		vec2 flow = (radialFlow + tangentialFlow + wake) *
			falloff * uPointerStrength * organicVariation;
		float flowLength = length(flow);
		if (flowLength > uMaxDisplacement) {
			flow *= uMaxDisplacement / flowLength;
		}

		vec2 displaced = base + idle + flow;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 0.0, 1.0);
		gl_PointSize = aSize * uPixelRatio;
		vSeed = aSeed;
		vec3 holtsColor = vec3(0.7843137, 0.8235294, 1.0);
		vec3 davColor = vec3(0.3529412, 0.4235294, 1.0);
		vColor = mix(holtsColor, davColor, aColorGroup);
	}
`;

const fragmentShader = /* glsl */ `
	uniform float uOpacity;

	varying float vSeed;
	varying vec3 vColor;

	void main() {
		vec2 centeredPoint = gl_PointCoord - 0.5;
		float distanceFromCenter = length(centeredPoint) * 2.0;
		float particle = 1.0 - smoothstep(0.28, 1.0, distanceFromCenter);
		float alpha = particle * uOpacity * (0.88 + vSeed * 0.12);

		if (alpha < 0.01) discard;
		gl_FragColor = vec4(vColor, alpha);
	}
`;

type ResponsiveTier = 'mobile' | 'tablet' | 'desktop';

type SpatialPoint = {
	x: number;
	y: number;
	order: number;
	colorGroup: number;
};

type MorphParticleData = {
	targetA: Float32Array;
	targetB: Float32Array;
	colorGroups: Float32Array;
	seeds: Float32Array;
	sizes: Float32Array;
	flows: Float32Array;
	count: number;
	tier: ResponsiveTier;
};

function createRandom(seed: number) {
	let state = seed >>> 0;

	return () => {
		state += 0x6d2b79f5;
		let value = state;
		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

function getResponsiveTier(width: number): ResponsiveTier {
	if (width <= 520) return 'mobile';
	if (width < 820) return 'tablet';
	return 'desktop';
}

function getParticleCount(tier: ResponsiveTier) {
	if (tier === 'mobile') return 11000;
	if (tier === 'tablet') return 14500;
	return 18000;
}

function getTracking(_text: string, fontSize: number) {
	return fontSize * -0.035;
}

function measureTrackedText(
	context: CanvasRenderingContext2D,
	text: string,
	fontSize: number,
) {
	context.font = `800 ${fontSize}px ${FONT_STACK}`;
	const tracking = getTracking(text, fontSize);
	const widths = Array.from(text, (character) => context.measureText(character).width);
	return (
		widths.reduce((total, width) => total + width, 0) +
		tracking * (text.length - 1)
	);
}

function findFontSize(
	context: CanvasRenderingContext2D,
	text: string,
	maximumWidthRatio = 0.9,
) {
	const maximumFontSize = SAMPLE_HEIGHT * 0.82;
	const maximumWidth = SAMPLE_WIDTH * maximumWidthRatio;
	let low = 48;
	let high = maximumFontSize;

	for (let iteration = 0; iteration < 14; iteration += 1) {
		const middle = (low + high) / 2;
		if (measureTrackedText(context, text, middle) <= maximumWidth) {
			low = middle;
		} else {
			high = middle;
		}
	}

	return low;
}

function drawTrackedText(
	context: CanvasRenderingContext2D,
	text: string,
	fontSize: number,
) {
	context.font = `800 ${fontSize}px ${FONT_STACK}`;
	const tracking = getTracking(text, fontSize);
	const widths = Array.from(text, (character) => context.measureText(character).width);
	const totalWidth =
		widths.reduce((total, width) => total + width, 0) +
		tracking * (text.length - 1);
	let x = (SAMPLE_WIDTH - totalWidth) / 2;
	let splitX = x;

	for (let index = 0; index < text.length; index += 1) {
		context.fillText(text[index], x, SAMPLE_HEIGHT / 2);
		x += widths[index] + tracking;
		if (index === 4) splitX = x - tracking / 2;
	}

	return splitX;
}

function drawCenteredTrackedLine(
	context: CanvasRenderingContext2D,
	text: string,
	fontSize: number,
	y: number,
) {
	context.font = `800 ${fontSize}px ${FONT_STACK}`;
	const tracking = getTracking(text, fontSize);
	const widths = Array.from(text, (character) => context.measureText(character).width);
	const totalWidth =
		widths.reduce((total, width) => total + width, 0) +
		tracking * (text.length - 1);
	let x = (SAMPLE_WIDTH - totalWidth) / 2;

	for (let index = 0; index < text.length; index += 1) {
		context.fillText(text[index], x, y);
		x += widths[index] + tracking;
	}
}

function interleaveBits(value: number) {
	let result = value & 0x0000ffff;
	result = (result | (result << 8)) & 0x00ff00ff;
	result = (result | (result << 4)) & 0x0f0f0f0f;
	result = (result | (result << 2)) & 0x33333333;
	result = (result | (result << 1)) & 0x55555555;
	return result;
}

function mortonOrder(x: number, y: number) {
	const normalizedX = Math.max(
		0,
		Math.min(1023, Math.round((x / SAMPLE_WIDTH) * 1023)),
	);
	const normalizedY = Math.max(
		0,
		Math.min(1023, Math.round((y / SAMPLE_HEIGHT) * 1023)),
	);
	return interleaveBits(normalizedX) | (interleaveBits(normalizedY) << 1);
}

function sampleTextMask(
	text: string,
	tier: ResponsiveTier,
	randomSeed: number,
) {
	const samplingCanvas = document.createElement('canvas');
	samplingCanvas.width = SAMPLE_WIDTH;
	samplingCanvas.height = SAMPLE_HEIGHT;
	const context = samplingCanvas.getContext('2d', {
		willReadFrequently: true,
	});
	if (!context) return [];

	context.clearRect(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
	context.fillStyle = '#ffffff';
	context.textAlign = 'left';
	context.textBaseline = 'middle';
	const isMobileName = text === TEXT_B && tier === 'mobile';
	let splitX = SAMPLE_WIDTH / 2;

	if (isMobileName) {
		const lineFontSize = Math.min(
			findFontSize(context, 'Holtschke', 0.98),
			SAMPLE_HEIGHT * 0.55,
		);
		drawCenteredTrackedLine(
			context,
			'David',
			lineFontSize,
			SAMPLE_HEIGHT * 0.25,
		);
		drawCenteredTrackedLine(
			context,
			'Holtschke',
			lineFontSize,
			SAMPLE_HEIGHT * 0.75,
		);
	} else {
		splitX = drawTrackedText(
			context,
			text,
			findFontSize(context, text, tier === 'mobile' ? 0.98 : 0.9),
		);
	}
	const firstSegmentColorGroup = text === TEXT_A ? 0 : 1;

	const image = context.getImageData(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
	const sampleStep = 2;
	const jitterAmount = sampleStep * 0.18;
	const random = createRandom(randomSeed);
	const points: SpatialPoint[] = [];

	for (let y = 0; y < SAMPLE_HEIGHT; y += sampleStep) {
		const rowOffset = Math.floor(random() * sampleStep);
		for (let x = rowOffset; x < SAMPLE_WIDTH; x += sampleStep) {
			const alpha = image.data[(y * SAMPLE_WIDTH + x) * 4 + 3];
			if (alpha < 104) continue;

			const jitteredX = x + (random() - 0.5) * jitterAmount;
			const jitteredY = y + (random() - 0.5) * jitterAmount;
			points.push({
				x: jitteredX,
				y: jitteredY,
				order: mortonOrder(jitteredX, jitteredY),
				colorGroup:
					isMobileName
						? jitteredY < SAMPLE_HEIGHT / 2
							? 1
							: 0
						: jitteredX < splitX
						? firstSegmentColorGroup
						: 1 - firstSegmentColorGroup,
			});
		}
	}

	points.sort((first, second) => first.order - second.order);
	return points;
}

function getTargetCenter(points: SpatialPoint[]) {
	let minX = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;

	for (const point of points) {
		minX = Math.min(minX, point.x);
		maxX = Math.max(maxX, point.x);
		minY = Math.min(minY, point.y);
		maxY = Math.max(maxY, point.y);
	}

	return {
		x: (minX + maxX) / 2,
		y: (minY + maxY) / 2,
	};
}

function selectSpatialPoints(points: SpatialPoint[], count: number) {
	const selected: SpatialPoint[] = [];
	for (let index = 0; index < count; index += 1) {
		const sourceIndex = Math.min(
			points.length - 1,
			Math.floor(((index + 0.5) * points.length) / count),
		);
		selected.push(points[sourceIndex]);
	}

	return selected;
}

function createColorMatchedTargets(
	pointsA: SpatialPoint[],
	pointsB: SpatialPoint[],
	requestedCount: number,
) {
	const groupsA = [
		pointsA.filter((point) => point.colorGroup === 0),
		pointsA.filter((point) => point.colorGroup === 1),
	];
	const groupsB = [
		pointsB.filter((point) => point.colorGroup === 0),
		pointsB.filter((point) => point.colorGroup === 1),
	];
	const capacities = [
		Math.min(groupsA[0].length, groupsB[0].length),
		Math.min(groupsA[1].length, groupsB[1].length),
	];
	const totalCount = Math.min(
		requestedCount,
		capacities[0] + capacities[1],
	);
	const groupZeroRatio =
		(groupsA[0].length / pointsA.length +
			groupsB[0].length / pointsB.length) /
		2;
	let groupZeroCount = Math.min(
		capacities[0],
		Math.round(totalCount * groupZeroRatio),
	);
	let groupOneCount = Math.min(capacities[1], totalCount - groupZeroCount);
	let unassignedCount = totalCount - groupZeroCount - groupOneCount;

	const groupZeroRoom = capacities[0] - groupZeroCount;
	const additionalGroupZero = Math.min(unassignedCount, groupZeroRoom);
	groupZeroCount += additionalGroupZero;
	unassignedCount -= additionalGroupZero;
	groupOneCount += Math.min(
		unassignedCount,
		capacities[1] - groupOneCount,
	);

	const groupCounts = [groupZeroCount, groupOneCount];
	const centerA = getTargetCenter(pointsA);
	const centerB = getTargetCenter(pointsB);
	const targetA = new Float32Array(totalCount * 3);
	const targetB = new Float32Array(totalCount * 3);
	const colorGroups = new Float32Array(totalCount);
	let particleIndex = 0;

	for (let colorGroup = 0; colorGroup <= 1; colorGroup += 1) {
		const count = groupCounts[colorGroup];
		const selectedA = selectSpatialPoints(groupsA[colorGroup], count);
		const selectedB = selectSpatialPoints(groupsB[colorGroup], count);

		for (let groupIndex = 0; groupIndex < count; groupIndex += 1) {
			const pointA = selectedA[groupIndex];
			const pointB = selectedB[groupIndex];
			const offset = particleIndex * 3;
			targetA[offset] = (pointA.x - centerA.x) / SAMPLE_WIDTH;
			targetA[offset + 1] = (centerA.y - pointA.y) / SAMPLE_WIDTH;
			targetA[offset + 2] = 0;
			targetB[offset] = (pointB.x - centerB.x) / SAMPLE_WIDTH;
			targetB[offset + 1] = (centerB.y - pointB.y) / SAMPLE_WIDTH;
			targetB[offset + 2] = 0;
			colorGroups[particleIndex] = colorGroup;
			particleIndex += 1;
		}
	}

	return {
		targetA,
		targetB,
		colorGroups,
		count: totalCount,
	};
}

function createMorphParticleData(width: number): MorphParticleData | null {
	const tier = getResponsiveTier(width);
	const requestedCount = getParticleCount(tier);
	const pointsA = sampleTextMask(TEXT_A, tier, 0x686f6c74);
	const pointsB = sampleTextMask(TEXT_B, tier, 0x64617669);
	if (pointsA.length === 0 || pointsB.length === 0) return null;

	const matchedTargets = createColorMatchedTargets(
		pointsA,
		pointsB,
		requestedCount,
	);
	if (matchedTargets.count === 0) return null;

	const random = createRandom(0x6d6f7270);
	const seeds = new Float32Array(matchedTargets.count);
	const sizes = new Float32Array(matchedTargets.count);
	const flows = new Float32Array(matchedTargets.count);
	const isMobile = tier === 'mobile';

	for (let index = 0; index < matchedTargets.count; index += 1) {
		const seed = random();
		seeds[index] = seed;
		sizes[index] = isMobile ? 0.72 + seed * 0.28 : 0.82 + seed * 0.34;
		flows[index] = random();
	}

	return {
		targetA: matchedTargets.targetA,
		targetB: matchedTargets.targetB,
		colorGroups: matchedTargets.colorGroups,
		seeds,
		sizes,
		flows,
		count: matchedTargets.count,
		tier,
	};
}

function createGeometry(data: MorphParticleData) {
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(data.targetA, 3));
	geometry.setAttribute('aTargetA', new THREE.BufferAttribute(data.targetA, 3));
	geometry.setAttribute('aTargetB', new THREE.BufferAttribute(data.targetB, 3));
	geometry.setAttribute(
		'aColorGroup',
		new THREE.BufferAttribute(data.colorGroups, 1),
	);
	geometry.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 1));
	geometry.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1));
	geometry.setAttribute('aFlow', new THREE.BufferAttribute(data.flows, 1));
	return geometry;
}

function smootherstep(progress: number) {
	const t = Math.max(0, Math.min(1, progress));
	return t * t * t * (t * (t * 6 - 15) + 10);
}

function getMorphProgress(elapsedMilliseconds: number) {
	const elapsed = elapsedMilliseconds % CYCLE_DURATION_MS;
	if (elapsed < HOLD_DURATION_MS) return 0;

	const firstMorphEnd = HOLD_DURATION_MS + MORPH_DURATION_MS;
	if (elapsed < firstMorphEnd) {
		return smootherstep((elapsed - HOLD_DURATION_MS) / MORPH_DURATION_MS);
	}

	const secondHoldEnd = firstMorphEnd + HOLD_DURATION_MS;
	if (elapsed < secondHoldEnd) return 1;
	return 1 - smootherstep((elapsed - secondHoldEnd) / MORPH_DURATION_MS);
}

function initializeWordmark(root: HTMLElement) {
	const canvas = root.querySelector('canvas');
	if (!(canvas instanceof HTMLCanvasElement)) return;

	const initialParticleData = createMorphParticleData(root.clientWidth);
	if (!initialParticleData) return;
	root.dataset.nameLayout =
		initialParticleData.tier === 'mobile' ? 'split' : 'single';

	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: false,
			powerPreference: 'high-performance',
		});
	} catch {
		return;
	}

	renderer.setClearColor(0x000000, 0);
	renderer.outputColorSpace = THREE.SRGBColorSpace;

	const scene = new THREE.Scene();
	const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
	let geometry = createGeometry(initialParticleData);
	const uniforms = {
		uTime: { value: 0 },
		uMorph: { value: 0 },
		uCanvasWidth: { value: 1 },
		uPixelRatio: { value: 1 },
		uPointerStrength: { value: 0 },
		uInteractionRadius: { value: 115 },
		uMaxDisplacement: { value: 58 },
		uPointer: { value: new THREE.Vector2(0, 0) },
		uPointerVelocity: { value: new THREE.Vector2(0, 0) },
		uOpacity: { value: 0.92 },
	};
	const material = new THREE.ShaderMaterial({
		uniforms,
		vertexShader,
		fragmentShader,
		transparent: true,
		depthTest: false,
		depthWrite: false,
		blending: THREE.NormalBlending,
	});
	const points = new THREE.Points(geometry, material);
	points.frustumCulled = false;
	scene.add(points);

	const rawPointer = new THREE.Vector2(0, 0);
	const smoothedPointer = new THREE.Vector2(0, 0);
	const rawPointerVelocity = new THREE.Vector2(0, 0);
	const smoothedPointerVelocity = new THREE.Vector2(0, 0);
	let previousSmoothedPointerX = 0;
	let previousSmoothedPointerY = 0;
	let width = 1;
	let height = 1;
	let lastGeometryWidth = root.clientWidth;
	let lastGeometryHeight = root.clientHeight;
	let animationFrame = 0;
	let resizeFrame = 0;
	let rebuildTimer = 0;
	let inViewport = true;
	let documentVisible = document.visibilityState === 'visible';
	let destroyed = false;
	let hasPointerPosition = false;
	let interactionTarget = 0;
	let interactionStrength = 0;
	let lastPointerMove = Number.NEGATIVE_INFINITY;
	let lastFrameTime = performance.now();
	const morphStartTime = performance.now();

	const rebuildGeometry = () => {
		rebuildTimer = 0;
		if (destroyed) return;

		const nextParticleData = createMorphParticleData(width);
		if (!nextParticleData) return;

		const previousGeometry = geometry;
		geometry = createGeometry(nextParticleData);
		points.geometry = geometry;
		lastGeometryWidth = width;
		lastGeometryHeight = height;
		root.dataset.nameLayout =
			nextParticleData.tier === 'mobile' ? 'split' : 'single';
		previousGeometry.dispose();
	};

	const scheduleGeometryRebuild = () => {
		const tierChanged =
			getResponsiveTier(width) !== getResponsiveTier(lastGeometryWidth);
		const meaningfulWidthChange =
			Math.abs(width - lastGeometryWidth) >
			Math.max(96, lastGeometryWidth * 0.16);
		const meaningfulHeightChange =
			Math.abs(height - lastGeometryHeight) > 48;

		if (!tierChanged && !meaningfulWidthChange && !meaningfulHeightChange) return;
		if (rebuildTimer) window.clearTimeout(rebuildTimer);
		rebuildTimer = window.setTimeout(
			rebuildGeometry,
			RESIZE_REBUILD_DELAY_MS,
		);
	};

	const resize = () => {
		resizeFrame = 0;
		width = Math.max(1, root.clientWidth);
		height = Math.max(1, root.clientHeight);
		const tier = getResponsiveTier(width);
		const pixelRatio = Math.min(
			window.devicePixelRatio || 1,
			tier === 'mobile' ? 2 : 1.75,
		);

		renderer.setPixelRatio(pixelRatio);
		renderer.setSize(width, height, false);
		camera.left = -width / 2;
		camera.right = width / 2;
		camera.top = height / 2;
		camera.bottom = -height / 2;
		camera.updateProjectionMatrix();

		uniforms.uCanvasWidth.value = width;
		uniforms.uPixelRatio.value = pixelRatio;
		uniforms.uInteractionRadius.value =
			tier === 'mobile' ? 62 : tier === 'tablet' ? 90 : 115;
		uniforms.uMaxDisplacement.value =
			tier === 'mobile' ? 34 : tier === 'tablet' ? 48 : 58;
		uniforms.uOpacity.value = tier === 'mobile' ? 0.9 : 0.92;
		scheduleGeometryRebuild();
		renderer.render(scene, camera);
	};

	const requestResize = () => {
		if (resizeFrame || destroyed) return;
		resizeFrame = window.requestAnimationFrame(resize);
	};

	const requestRender = () => {
		if (animationFrame || destroyed || !inViewport || !documentVisible) return;
		lastFrameTime = performance.now();
		animationFrame = window.requestAnimationFrame(render);
	};

	const render = (now: number) => {
		animationFrame = 0;
		if (destroyed || !inViewport || !documentVisible) return;

		const elapsedFrameSeconds = Math.max(0, (now - lastFrameTime) / 1000);
		const deltaSeconds = Math.min(elapsedFrameSeconds, 0.05);
		lastFrameTime = now;

		if (now - lastPointerMove > 120) interactionTarget = 0;

		const pointerPositionSmoothing = 1 - Math.exp(-14 * deltaSeconds);
		smoothedPointer.lerp(rawPointer, pointerPositionSmoothing);

		if (deltaSeconds > 0) {
			rawPointerVelocity.set(
				(smoothedPointer.x - previousSmoothedPointerX) / deltaSeconds,
				(smoothedPointer.y - previousSmoothedPointerY) / deltaSeconds,
			);
			const rawVelocityLength = rawPointerVelocity.length();
			if (rawVelocityLength > 900) {
				rawPointerVelocity.multiplyScalar(900 / rawVelocityLength);
			}
		}
		previousSmoothedPointerX = smoothedPointer.x;
		previousSmoothedPointerY = smoothedPointer.y;

		const pointerVelocitySmoothing = 1 - Math.exp(-9 * deltaSeconds);
		smoothedPointerVelocity.lerp(
			rawPointerVelocity,
			pointerVelocitySmoothing,
		);

		const interactionResponse = interactionTarget > interactionStrength ? 10 : 5.2;
		const interactionSmoothing =
			1 - Math.exp(-interactionResponse * deltaSeconds);
		interactionStrength +=
			(interactionTarget - interactionStrength) * interactionSmoothing;

		uniforms.uTime.value = now / 1000;
		uniforms.uMorph.value = getMorphProgress(now - morphStartTime);
		uniforms.uPointer.value.copy(smoothedPointer);
		uniforms.uPointerVelocity.value.copy(smoothedPointerVelocity);
		uniforms.uPointerStrength.value = interactionStrength;
		renderer.render(scene, camera);
		animationFrame = window.requestAnimationFrame(render);
	};

	const updatePointer = (event: PointerEvent) => {
		const bounds = root.getBoundingClientRect();
		rawPointer.set(
			event.clientX - bounds.left - width / 2,
			height / 2 - (event.clientY - bounds.top),
		);

		if (!hasPointerPosition) {
			smoothedPointer.copy(rawPointer);
			previousSmoothedPointerX = smoothedPointer.x;
			previousSmoothedPointerY = smoothedPointer.y;
			hasPointerPosition = true;
		}

		lastPointerMove = performance.now();
		interactionTarget = 1;
		requestRender();
	};

	const releasePointer = () => {
		interactionTarget = 0;
		lastPointerMove = Number.NEGATIVE_INFINITY;
	};

	const handleVisibilityChange = () => {
		documentVisible = document.visibilityState === 'visible';
		if (!documentVisible && animationFrame) {
			window.cancelAnimationFrame(animationFrame);
			animationFrame = 0;
		} else {
			requestRender();
		}
	};

	const handleContextLost = () => {
		delete root.dataset.particleReady;
		if (animationFrame) {
			window.cancelAnimationFrame(animationFrame);
			animationFrame = 0;
		}
	};

	const handleContextRestored = () => {
		if (destroyed) return;
		resize();
		root.dataset.particleReady = 'true';
		requestRender();
	};

	const intersectionObserver = new IntersectionObserver(
		([entry]) => {
			inViewport = entry?.isIntersecting ?? false;
			if (!inViewport && animationFrame) {
				window.cancelAnimationFrame(animationFrame);
				animationFrame = 0;
			} else {
				requestRender();
			}
		},
		{ threshold: 0.01 },
	);
	const resizeObserver = new ResizeObserver(requestResize);

	root.addEventListener('pointermove', updatePointer, { passive: true });
	root.addEventListener('pointerleave', releasePointer, { passive: true });
	root.addEventListener('pointercancel', releasePointer, { passive: true });
	canvas.addEventListener('webglcontextlost', handleContextLost, { passive: true });
	canvas.addEventListener('webglcontextrestored', handleContextRestored, {
		passive: true,
	});
	document.addEventListener('visibilitychange', handleVisibilityChange);
	intersectionObserver.observe(root);
	resizeObserver.observe(root);
	resize();
	renderer.render(scene, camera);
	root.dataset.particleReady = 'true';
	requestRender();

	return () => {
		destroyed = true;
		delete root.dataset.particleReady;
		if (animationFrame) window.cancelAnimationFrame(animationFrame);
		if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
		if (rebuildTimer) window.clearTimeout(rebuildTimer);
		root.removeEventListener('pointermove', updatePointer);
		root.removeEventListener('pointerleave', releasePointer);
		root.removeEventListener('pointercancel', releasePointer);
		canvas.removeEventListener('webglcontextlost', handleContextLost);
		canvas.removeEventListener('webglcontextrestored', handleContextRestored);
		document.removeEventListener('visibilitychange', handleVisibilityChange);
		intersectionObserver.disconnect();
		resizeObserver.disconnect();
		geometry.dispose();
		material.dispose();
		renderer.dispose();
	};
}

class ParticleWordmarkElement extends HTMLElement {
	cleanup?: () => void;
	disconnected = false;
	startToken = 0;
	motionPreference?: MediaQueryList;

	async start() {
		const token = ++this.startToken;
		try {
			await document.fonts?.ready;
		} catch {
			// System fonts remain available if FontFaceSet readiness fails.
		}

		if (
			this.disconnected ||
			token !== this.startToken ||
			this.motionPreference?.matches ||
			this.cleanup
		) {
			return;
		}
		this.cleanup = initializeWordmark(this);
	}

	handleMotionPreference = (event: MediaQueryListEvent) => {
		this.startToken += 1;
		if (event.matches) {
			this.cleanup?.();
			this.cleanup = undefined;
		} else {
			void this.start();
		}
	};

	connectedCallback() {
		this.disconnected = false;
		this.motionPreference = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		);
		this.motionPreference.addEventListener(
			'change',
			this.handleMotionPreference,
		);
		if (!this.motionPreference.matches) void this.start();
	}

	disconnectedCallback() {
		this.disconnected = true;
		this.startToken += 1;
		this.cleanup?.();
		this.cleanup = undefined;
		this.motionPreference?.removeEventListener(
			'change',
			this.handleMotionPreference,
		);
		this.motionPreference = undefined;
	}
}

if (!customElements.get('particle-wordmark')) {
	customElements.define('particle-wordmark', ParticleWordmarkElement);
}
