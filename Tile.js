export default class Tile {
    #x
    #y
    #tileElement
    #value

    constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
        this.#tileElement = document.createElement('div')
        this.#tileElement.className = 'tile'
        tileContainer.append(this.#tileElement)
        this.value = value
    }

    set x(value) {
        this.#x = value
        this.#tileElement.style.setProperty('--x', value)
    }

    set y(value) {
        this.#y = value
        this.#tileElement.style.setProperty('--y', value)
    }

    get value() { return this.#value }

    set value(v) {
        const power = Math.log2(v)
        const backgroundLightness = 100 - power * 9
        this.#tileElement.style.setProperty('--background-lightness', `${backgroundLightness}%`)
        this.#tileElement.style.setProperty('--text-lightness', `${backgroundLightness > 50 ? 10 : 90}%`)
        this.#tileElement.textContent = v
        this.#value = v
    }

    remove() {
        this.#tileElement.remove()
    }

    waitForTransition(animation) {
        return new Promise(resolve => {
            this.#tileElement.addEventListener(animation ? 'animationend' : 'transitionend', resolve, { once: true })
        })
    }
}