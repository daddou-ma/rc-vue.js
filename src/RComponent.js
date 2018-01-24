/**
 * rcVue
 * MIT Licensed
 */
import VirtualDOM from './VirtualDOM/VirtualDOM';

class RComponent {
	constructor(props, context) {
		this._execHook('preLoad');

		this.$parent = props.$parent || null;
		this._vdom	 = null;

		this.props = props;

		this._execHook('postLoad');
	}

	isComponent() {
		return true;
	}

	setState(obj) {
		this._execHook('preStateChange');
		this.state = Object.assign(this.state, obj);
		this._execHook('postStateChange');
		this._render();
	}

	_execHook (hook) {
		if(typeof this[hook] == 'function') {
			this[hook]();
		}
	}

	_render() {
		const oldVDom = this._vdom;
		const newVDom = this.render();
		
		this._execHook('preRender');
		this._vdom = newVDom;
		VirtualDOM.updateElement(this.$parent, newVDom, oldVDom);
		this._execHook('postRender');
	}
}

export default RComponent;