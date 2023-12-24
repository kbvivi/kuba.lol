const JUMPER = Number(localStorage.getItem('SETTINGS.JUMPER') || 5),
    DEAD_ZONE = 50,
    FREQ = Number(localStorage.getItem("SETTINGS.FREQ") || 50)

// ================



const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const screenSize = {
    h: window.screen.height - 5,
    w: window.screen.width - 5
}

const waitFor_DELAY = 50, waitFor_TIMEOUT = 8000;
const waitFor = async (o) => new Promise((rs,re) => {
    const errorTimeout = setTimeout(() => {
        clearInterval(waitForInterval);
        re(['timeout', waitFor_TIMEOUT]);
    }, waitFor_TIMEOUT)
    const waitForInterval = setInterval(() => {
        if(o) {
            clearTimeout(errorTimeout);
            rs(true)
        }
    }, waitFor_DELAY);
}) 



const DVD_SS = class {
    size = {
        h: 260,
        w: 320
    }
    pos = {
        x: getRandomInt(0, screenSize.w - this.size.w),
        y: getRandomInt(0, screenSize.h - this.size.h - DEAD_ZONE)
    }
    xx = Boolean(getRandomInt(0,1));
    yy = Boolean(getRandomInt(0,1));
    /** @type {Window} */
    window = null;

    constructor(autoStart = true){
        if(autoStart) this.start();
    }

    async start() {
        this.load();
    }

    async load() {
        this.window = window.open("/dvd/dvd.html", "_blank", `popup`)
        this.window.resizeTo(this.size.w, this.size.h)
        this.window.moveTo(this.pos.x, this.pos.y)
        this.startMoving()
    }

    startMoving() {
        this.window.postMessage(['sendInitialData', {xx:this.xx, yy:this.yy, pos: this.pos, size: this.size, JUMPER, FREQ, DEAD_ZONE, screenSize}])
    }

}

/**@type {DVD_SS[]} */
const popups = []

let nextWindowAllowed = true;
window.spawnLogo = () => {
    if(!nextWindowAllowed) return;
    nextWindowAllowed = false; setTimeout(() => nextWindowAllowed = true, 1000)

    const dvd = new DVD_SS();
    popups.push(dvd)
}


window.clearLogos = () => popups.forEach(p => p.window.close())
window.addEventListener('beforeunload', clearLogos, {capture: true})

