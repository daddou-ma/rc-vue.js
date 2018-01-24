/** @namespace VirtualDOM */

/**
 * rcVue
 * MIT License
 * @jsx rc
 * @module VirtualDom
 * @memberof VirtualDOM
 */

const is = require('./is');

/**
 * @type {Object}
 */
let doc = {};

if (typeof document !== 'undefined') {
	doc = document;
}

/**
* @desc This is a description
* @access private
* @example
* dfsdfsdfsd
* @method myMethodName
* @param {string} str - some string
* @param {Object} obj - some object
* @return {Object} some bool
*/


/**
 * @method initDocument
 * @desc Setting the document object for unit testing of the dom.
 * @param {String} document - the fake document object
 * @example
 * import {JSDOM} from 'jsdom';
 * const dom = new JSDOM('<div id="test"></div>');
 * const {document} = dom.window;
 * const root = document.getElementById('test');
 * RcVirtualDOM.initDocument(document);
 */
const initDocument = function initDocument(document) {
	doc = document;
};



/**
 * @access public
 * @desc Render a RComponent to a dom element.
 * @method render
 * @param {Class} component - virtual dom node object
 * @param {Object} $element - dom element object
 * @param {Function} callback - callback to run after render.
 * @example
 * const root = document.getElementById('root');
 * RcVirtualDOM.render(<TestComponent />, root);
 */
const render = function render (component, $element, callback) {
	const instance = new component.type(component.props);
	instance.$parent = $element;
	instance._render();
	
	if(typeof callback == 'function') {
		callback();
	}
};


/**
 * @access public
 * @desc Render a RComponent to a dom element.
 * @method rCreate
 * @param {String|Function|Class} type - The type of HTML Tag or the Component Constructor
 * @param {Object} props - The Component|Node props
 * @param {...Object} children - Childs
 * @return {Object}
 * @example
 * RcVirtualDOM.rCreate('div', {id: 'container'}, Hello, World !);
 */
const rCreate = function rCreate (type, props = {}, ...children) {
	return {type, props: props || {}, children: children || []};
};


/**
 * @access private
 * @desc Render Virtual DOM objects to a real DOM object
 * @method createElement
 * @param {Object} node - Virtual DOM object
 * @return {Object} DOM element
 */
const createElement = function createElement (node) {
	if (is.textNode(node)) {
		return doc.createTextNode(node);
	} else if (is.componentNode(node)) {
		const instance = new node.type(node.props);
		return createElement(instance.render());
	} else if (is.statelessComponentNode(node)) {
		return createElement(node());
	}


	const $element = doc.createElement(node.type);

	setProperties($element, node.props);

	node.children
		.map(createElement)
		.map($element.appendChild.bind($element));

	return $element;
}; 


/**
 * @access private
 * @desc Set an array of properties to a DOM element
 * @method setProperties
 * @param {Object} $element - DOM Element
 * @param {Array} props - array of properties
 */
const setProperties = function setProperties ($element, props) {
	Object.keys(props).forEach((key) => {
		setProperty($element, key, props[key]);
	});
};


/**
 * @access private
 * @desc Set a single property to a DOM element
 * @method setProperty
 * @param {Object} $element - DOM Element
 * @param {String} property - property name
 * @param {String|Function} value - property value
 */
const setProperty = function setProperty ($element, property, value) {
	if (property === 'className') {
		$element.setAttribute('class', value);
	} else if (is.eventProperty(property)) {
		addEventListener($element, property, value);
		return;
	} else if (is.referenceFunction(property, value)) {
		value($element);
		return;
	} else {

		$element.setAttribute(property, value);
	}
};


/**
 * @access private
 * @desc Add an event lister to a DOM Element
 * @method addEventListener
 * @param {Object} $element - DOM Element
 * @param {String} name - event name
 * @param {Function} handler - event handler
 */
const addEventListener = function addEventListener ($element, name, handler) {
	$element.addEventListener(getEventNameFromProperty(name), handler);
};


/**
 * @access private
 * @desc Add an event lister to a DOM Element
 * @method getEventNameFromProperty
 * @param {String} property - property name
 * @return {String} event name
 */
const getEventNameFromProperty = function getEventNameFromProperty (property) {
	if (property === 'onClick') {
		return 'click';
	} else if (property === 'onChange') {
		return 'input';
	}
};

/**
 * @access private
 * @desc update a dom element by compairing the old and new virtual dom objects
 * @method updateElement
 * @param {Object} $element - parent DOM Element
 * @param {Object} oldNode - Old Virtual DOM Node
 * @param {Object} newNode - New Virtual DOM Node
 * @param {Number} index - index of the Node in his parent
 */
const updateElement = function updateElement ($parent, newNode, oldNode, index = 0) {
	if (oldNode == undefined) {
		$parent.appendChild(
			createElement(newNode)
		);

	} else if (newNode == undefined) {
		$parent.removeChild(
      $parent.childNodes[index]
    );
	} else if (is.nodeChanged(newNode, oldNode)) {

    $parent.replaceChild(
      createElement(newNode),
      $parent.childNodes[index]
    );

  } else if (newNode.type) {
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;

    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],  
        i
      );
    }

    updateAttributes($parent.childNodes[index], newNode, oldNode);
  }
};


/**
 * @access private
 * @desc update a dom element attributes
 * @method updateAttributes
 * @param {Object} $element - parent DOM Element
 * @param {Object} oldNode - Old Virtual DOM Node
 * @param {Object} newNode - New Virtual DOM Node
 */
const updateAttributes = function updateAttributes ($element, newNode, oldNode) {

	Object.keys(oldNode.props).forEach((key) => {
		if(!newNode.props[key]) {
			$element.removeAttribute(key);
		}
	});

	Object.keys(newNode.props).forEach((key) => {
		if(newNode.props[key] != oldNode.props[key]) {
			setProperty($element, key, newNode.props[key]);
		}
	});
};

export default {
	initDocument,
	render,
	rCreate,
	updateElement
};