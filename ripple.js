/**
 * This is the only function that provides a ripple effect (hover or click)
 * on elements with classes 'ripple-hover' and 'ripple-click'.
 * The function is self-invoked. To make it work include this
 * file in the page's HTML content directly.
 * You can also import it into your other script file
 * like this const ripple = require('path to this file').
 *
 * Script require also CSS styles to be included into page,
 * othwerwise you will not see effects.
 *
 * @author Outcomer <773021792e@gmail.com>
 *
 * @return void
 */
const rippleFn = () => {
	/**
	 * @param {WeakMap}
	 */
	const elementDataMap = new WeakMap()

	/**
	 * Save anything regarding to element into element itself.
	 *
	 * @param {Element} element HTML element.
	 * @param {Object}  data    Data to save.
	 */
	const setElementData = (element, data) => {
		elementDataMap.set(element, data)
	}

	/**
	 * Get saved data from an element.
	 *
	 * @param {Element} element HTML element.
	 *
	 * @return {Object} Saved data or an empty object.
	 */
	const getElementData = (element) => {
		if (typeof elementDataMap.get(element, 'data') === 'undefined') {
			setElementData(element, {})
		}

		return elementDataMap.get(element, 'data')
	}

	/**
	 * Bases on event coordinates and target size
	 * function calculates size of circle and it's
	 * position so that this circle cover target.
	 *
	 * @param {MouseEvent} event  Browser event.
	 * @param {Element}    target HTML element.
	 *
	 * @return {Object} A set of calculated coordinates for ripple.
	 */
	const prepareRipple = function (event, target) {
		// Get width and height that will 100% cover target on ripple.
		const client = target.getBoundingClientRect()
		const x = event.clientX
		const y = event.clientY
		const toLeft = x - client.left
		const toRight = client.right - x
		const toTop = y - client.top
		const toBottom = client.bottom - y
		const maxX = Math.max(toLeft, toRight)
		const maxY = Math.max(toTop, toBottom)
		const deltaRadius = Math.hypot(maxX, maxY) - Math.max(maxX, maxY)

		const buttonWidth = (Math.max(maxX, maxY) + deltaRadius) * 2
		const buttonHeight = buttonWidth

		const ripple = document.createElement('span')
		ripple.className = 'ripple'

		ripple.style.height = `${buttonHeight}px`
		ripple.style.width = `${buttonWidth}px`
		ripple.style.left = `${event.pageX - target.getBoundingClientRect().left - buttonWidth / 2}px`
		ripple.style.top = `${event.pageY - (target.getBoundingClientRect().top + document.documentElement.scrollTop) - buttonHeight / 2}px`

		return ripple
	}

	/**
	 * Ripple runner.
	 * Inject ripple element into DOM and apply
	 * CSS styles and classes needed for animation.
	 *
	 * @param {MouseEvent} event  Browser event.
	 * @param {Element}    target HTML element.
	 *
	 * @return {Promise} Promise will be resolved once animation finished.
	 */
	const doRippleClick = async function (event, target) {
		setElementData(target, { licketySplitDoRipleClick: true })
		const ripples = target.querySelector('.ripple')

		if (ripples !== null) {
			ripples.remove()
		}

		const rippleHTML = prepareRipple(event, target)
		rippleHTML.classList.add('ripple', 'ripple-effect-click')

		target.appendChild(rippleHTML)

		// eslint-disable-next-line no-unused-vars
		return await new Promise((resolve, reject) => {
			const transition = window.getComputedStyle(rippleHTML).transitionDuration
			const delay =
				Math.max.apply(Math, transition.split(',').map(parseFloat)) * 1000

			setTimeout(
				function (timerTarget) {
					setElementData(target, { licketySplitDoRipleClick: false })
					rippleHTML.remove()
					resolve([event, timerTarget])
				},
				delay,
				target,
				rippleHTML
			)
		})
	}

	/**
	 * Callback for hover IN event.
	 * Inject ripple element into DOM and apply
	 * CSS styles and classes needed for animation.
	 *
	 * @param {MouseEvent} event Browser event.
	 *
	 * @return {Promise} Promise resolved immediately.
	 */
	const doRippleHoverIn = async function (event) {
		const rippleElement = event.target.closest('.ripple-hover')
		const relatedTarget = event.relatedTarget
			? event.relatedTarget.closest('.ripple-hover')
			: null

		if (!rippleElement || rippleElement === relatedTarget) {
			return
		}

		clearTimeout(getElementData(rippleElement).rippleHoverOutTimer)
		let rippleHTML = prepareRipple(event, rippleElement)
		const currentRipple = rippleElement.querySelector('.ripple')

		rippleHTML.classList.add('ripple', 'ripple-effect-hover-in')

		if (currentRipple === null) {
			rippleElement.appendChild(rippleHTML)
		} else {
			currentRipple.style.height = rippleHTML.style.height
			currentRipple.style.width = rippleHTML.style.width
			currentRipple.style.left = rippleHTML.style.left
			currentRipple.style.top = rippleHTML.style.top
			currentRipple.classList.remove('ripple-effect-hover-out')
			currentRipple.classList.add('ripple-effect-hover-in')

			rippleHTML = currentRipple
		}

		return Promise.resolve([event, rippleElement])
	}

	/**
	 * Callback for hover OUT event.
	 * Inject ripple element into DOM and apply
	 * CSS styles and classes needed for animation.
	 *
	 * @param {MouseEvent} event Browser event.
	 *
	 * @return {Promise} Promise will be resolved once animation finished.
	 */
	const doRippleHoverOut = async function (event) {
		const rippleElement = event.target.closest('.ripple-hover')
		const relatedTarget = event.relatedTarget
			? event.relatedTarget.closest('.ripple-hover')
			: null

		if (!rippleElement || rippleElement === relatedTarget) {
			return
		}

		let rippleHTML = prepareRipple(event, rippleElement)
		const currentRipple = rippleElement.querySelector('.ripple')

		if (currentRipple === null) {
			rippleElement.appendChild(rippleHTML)
		} else {
			currentRipple.style.height = rippleHTML.style.height
			currentRipple.style.width = rippleHTML.style.width
			currentRipple.style.left = rippleHTML.style.left
			currentRipple.style.top = rippleHTML.style.top
			currentRipple.classList.remove('ripple-effect-hover-in')
			currentRipple.classList.add('ripple-effect-hover-out')

			rippleHTML = currentRipple
		}

		// eslint-disable-next-line no-unused-vars
		return await new Promise((resolve, reject) => {
			const transition = window.getComputedStyle(rippleHTML).transitionDuration
			const delay = Math.max.apply(Math, transition.split(',').map(parseFloat)) * 1000

			const rippleHoverOutTimer = setTimeout(
				(timerTarget) => {
					rippleHTML.remove()
					resolve([event, timerTarget])
				},
				delay,
				rippleElement,
				rippleHTML
			)

			setElementData(rippleElement, { rippleHoverOutTimer })
		})
	}

	/**
	 * Callback for click event.
	 * Validates that no ripple currently in progress
	 * and if no - run new.
	 *
	 * @param {MouseEvent} event Browser event.
	 */
	const rippleClick = function (event) {
		if (!event.target.closest('.ripple-click')) {
			return
		}

		if (getElementData(event.target).licketySplitDoRipleClick) {
			return
		}

		doRippleClick(event, event.target).then(function (args) {
			const eventNew = new Event('licketySplitClickRipleDone')
			args[1].dispatchEvent(eventNew)
		})
	}

	const run = () => {
		document.querySelector('body').addEventListener('click', rippleClick)

		if ('ontouchstart' in window === false) {
			document.body.addEventListener('mouseover', doRippleHoverIn)
			document.body.addEventListener('mouseout', doRippleHoverOut)
		}
	}

	document.addEventListener('DOMContentLoaded', run)
}

export default rippleFn
