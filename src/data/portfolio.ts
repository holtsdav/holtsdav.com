import glassdays from '../../Assets/app-icons/glassdays.png';
import mute from '../../Assets/app-icons/mute-on-location.png';
import rogue from '../../Assets/app-icons/rogue-color.png';
import room from '../../Assets/app-icons/room-planner.svg';
import notilog from '../../Assets/portfolio/notilog.png';
import reviewbar from '../../Assets/portfolio/reviewbar.png';
import saveshelf from '../../Assets/portfolio/saveshelf.svg';
import catalog from '../../Assets/portfolio/catalog.svg';
import pdf from '../../Assets/portfolio/pdf-editor.svg';
import auxjam from '../../Assets/portfolio/auxjam.svg';
import glassHome from '../../Assets/glassdays-screenshots/home-light.png';
import glassWidgets from '../../Assets/glassdays-screenshots/widgets.png';
import glassCreate from '../../Assets/glassdays-screenshots/create-dark.png';
import glassFolders from '../../Assets/glassdays-screenshots/folders.png';
import muteScreen from '../../Assets/MuteOnLocation-preview.png';
import roomScreen from '../../Assets/RoomPlaner.png';
import rogueScreen from '../../Assets/rogue-color-gameplay.png';
import pdfScreen from '../../Assets/portfolio/pdf-demo.gif';
import type {ImageMetadata} from 'astro';
export interface Project {
 id:string; name:string; icon:ImageMetadata; platform:string; status:string;
 description:string; color:string; accent?:string; images:{src:ImageMetadata;alt:string;kind?:'phone'|'wide'}[];
 links:{label:string;href:string}[]; privacy?:string;
}
export const projects:Project[]=[
 {id:'glassdays',name:'Glassdays',icon:glassdays,platform:'iPhone & iPad',status:'App Store',description:'Photo countdowns and Home Screen widgets.',color:'#efecf5',images:[{src:glassHome,alt:'Glassdays countdowns with photos and pinned events',kind:'phone'},{src:glassWidgets,alt:'Glassdays Home Screen widgets',kind:'phone'},{src:glassCreate,alt:'Creating a countdown in Glassdays',kind:'phone'},{src:glassFolders,alt:'Glassdays countdown collections',kind:'wide'}],links:[{label:'App Store',href:'https://apps.apple.com/de/app/glassdays-countdown/id6785538729'}],privacy:'/privacy/glassdays/'},
 {id:'notilog',name:'NotiLog',icon:notilog,platform:'iPhone & iPad',status:'In development',description:'Save notifications through Shortcuts. Search and pin them on your device.',color:'#e8edf8',accent:'#864584',images:[],links:[],privacy:'/drafts/notilog-privacy/'},
 {id:'saveshelf',name:'SaveShelf',icon:saveshelf,platform:'iPhone',status:'In development',description:'A home for your games, with Steam imports and a wishlist.',color:'#edf1e8',accent:'#506735',images:[],links:[]},
 {id:'mute-on-location',name:'Mute On Location',icon:mute,platform:'Mac',status:'App Store',description:'Mute your Mac when you reach a saved place.',color:'#f1e9e1',images:[{src:muteScreen,alt:'Mute On Location’s menu bar window with saved places and mute status',kind:'wide'}],links:[{label:'Mac App Store',href:'https://apps.apple.com/de/app/mute-on-location/id6790398791?l=en-GB&mt=12'}],privacy:'/privacy/muteonlocation/'},
 {id:'reviewbar',name:'ReviewBar',icon:reviewbar,platform:'iPhone',status:'In development',description:'App Store releases, reviews and analytics, together on your iPhone.',color:'#e7eef9',accent:'#285f96',images:[],links:[]},
 {id:'pdf-editor',name:'PDF Editor',icon:pdf,platform:'Obsidian · Desktop',status:'Desktop beta',description:'Write, highlight and draw on PDFs in Obsidian.',color:'#eeebf4',images:[{src:pdfScreen,alt:'PDF Editor in Obsidian with text annotations and notes',kind:'wide'}],links:[{label:'GitHub',href:'https://github.com/holtsdav/PDF-Editor'}]},
 {id:'room-planner',name:'Room Planner',icon:room,platform:'Web',status:'Web tool',description:'Arrange a room, down to the measurements.',color:'#eaf0f7',images:[{src:roomScreen,alt:'Room Planner with a furnished floor plan, measurements and object library',kind:'wide'}],links:[{label:'Open tool',href:'https://holtsdav.com/RoomPlanner'},{label:'GitHub',href:'https://github.com/holtsdav/RoomPlanner'}]},
 {id:'auxjam',name:'AuxJam',icon:auxjam,platform:'Mobile',status:'Prototype',description:'Start a room, invite friends and queue music from Spotify or Apple Music.',color:'#edf0f9',accent:'#54668e',images:[],links:[]},
 {id:'rogue-color',name:'Rogue Color',icon:rogue,platform:'Desktop',status:'Game',description:'Switch colors to survive the swarm.',color:'#f1eaf0',images:[{src:rogueScreen,alt:'Rogue Color’s existing pixel-art gameplay screen',kind:'wide'}],links:[{label:'itch.io',href:'https://holtsdav.itch.io/rouge-color'}]},
 {id:'glassdays-catalog',name:'Glassdays JSON Editor',icon:catalog,platform:'Web',status:'Private tool',description:'Edit Glassdays events and countdown dates. Import and export JSON.',color:'#e9f2ed',accent:'#337064',images:[],links:[]},
];
