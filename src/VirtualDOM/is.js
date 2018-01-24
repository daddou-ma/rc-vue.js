/**
 * rcVue
 * MIT License
 * @jsx rc
 * Parent module
 * @module Is
 * @memberof VirtualDOM
 */


/**
 * @access private
 * @desc Check if the property is ref and it has a function value.
 * @method isReferenceFunction
 * @param {String} property - property name
 * @param {Function} value - the ref function
 * @return {Boolean} 
 */
export const referenceFunction = function isReferenceFunction(property, value) {
	if (typeof property == 'function') {
		return true;
	}
	return false;
};


/**
 * @access private
 * @desc Check if node is a text node.
 * @method isTextNode
 * @param {Object} node - virtual dom node object
 * @return {Boolean} 
 */
export const textNode = function isTextNode(node) {
	if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
		return true;
	}
	return false;
};


/**
 * @access private
 * @desc Check if node is a RComponent.
 * @method isComponentNode
 * @param {Object} node - virtual dom node object
 * @return {Boolean} 
 */
export const componentNode = function isComponentNode(node) {
	if (typeof node.type == 'function' && typeof node.type.prototype.isComponent === 'function') {
		return true;
	}

	return false;
};


/**
 * @access private
 * @desc Check if node is a stateless RComponent.
 * @method isStatelessComponentNode
 * @param {Object} node - virtual dom node object
 * @return {Boolean} 
 */
export const statelessComponentNode = function isStatelessComponentNode (node) {
	if (typeof node.type == 'function' && typeof node.type.prototype.isComponent != 'function') {
		return true;
	}

	return false;
};


/**
 * @access private
 * @desc Check if property name is an event property
 * @method isEventProperty
 * @param {String} propertyName - property name
 * @return {Boolean}
 */
export const eventProperty= function isEventProperty(propertyName) {
	if (propertyName == 'onClick' || propertyName == 'onChange') {
		return true;
	}

	return false;
};


/**
 * @access private
 * @desc Check if two vdom nodes are not equal
 * @method isNodeChanged
 * @param {Object} node1 - Virtual DOM object
 * @param {Object} node2 - Virtual DOM object
 * @return {Object} DOM element
 */
export const nodeChanged = function isNodeChanged(node1, node2) {
  return typeof node1 !== typeof node2 ||
         (typeof node1 == 'string' || typeof node1 == 'number' || typeof node1 == 'boolean') && node1 !== node2 ||
         node1.type !== node2.type
};
