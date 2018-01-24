import assert from 'assert';
import {RcVirtualDOM}	from '../src/RcVue';
import {JSDOM} from 'jsdom';
import TestComponent from './TestComponent';

const dom = new JSDOM('<div id="test"></div>');

const {document} = dom.window;
const root = document.getElementById('test');
RcVirtualDOM.initDocument(document);

describe('Test Virtual DOM', () => {

	describe('render()', () => {
		beforeEach(() => {
		  root.innerHTML = "";
		});

		it('should create a div node', () => {
			
			RcVirtualDOM.render(<TestComponent />, root);

			assert.equal(root.childNodes[0].textContent, 'testComponent');
		});

		it('should create only one div node', () => {
			
			RcVirtualDOM.render(<TestComponent />, root);

			assert.equal(root.childNodes.length, 1);
		});
	});

	describe('updateElement()', () => {
		beforeEach(() => {
		  root.innerHTML = "";
		});

		it('should create a text node', () => {
			RcVirtualDOM.updateElement(root, 'textElement');
			assert.equal(root.childNodes[0].textContent, 'textElement');
		});

		it('should create only one text node', () => {
			RcVirtualDOM.updateElement(root, 'textElement');
			assert.equal(root.childNodes.length, 1);
		});

		it('should update the text node', () => {
			RcVirtualDOM.updateElement(root, 'textElement');
			RcVirtualDOM.updateElement(root, 'newTextElement', 'textElement');
			assert.equal(root.childNodes.length, 1);
			assert.equal(root.childNodes[0].textContent, 'newTextElement');
		});

		it('should delete the text node', () => {
			RcVirtualDOM.updateElement(root, 'textElement');
			RcVirtualDOM.updateElement(root, null, 'textElement');
			assert.equal(root.childNodes.length, 0);
		});

		it('should create a node', () => {
			RcVirtualDOM.updateElement(root, (<div></div>));
			assert.equal(root.childNodes[0].nodeName, 'DIV');
		});

		it('should create only one node', () => {
			RcVirtualDOM.updateElement(root, (<div></div>));
			assert.equal(root.childNodes.length, 1);
		});

		it('should update the node', () => {
			RcVirtualDOM.updateElement(root, <div></div>);
			RcVirtualDOM.updateElement(root, <span></span>, <div></div>);
			assert.equal(root.childNodes.length, 1);
			assert.equal(root.childNodes[0].nodeName, 'SPAN');
		});

		it('should delete the node', () => {
			RcVirtualDOM.updateElement(root, <div></div>);
			RcVirtualDOM.updateElement(root, null, <div></div>);
			assert.equal(root.childNodes.length, 0);
		});

		it('should create a attributes', () => {
			RcVirtualDOM.updateElement(root, (<div></div>));
			RcVirtualDOM.updateElement(root, (<div id="identificator"></div>), (<div></div>));
			assert.equal(root.childNodes[0].getAttribute('id'), 'identificator');
		});

		it('should create only one attribute', () => {
			RcVirtualDOM.updateElement(root, (<div id="identificator"></div>));
			assert.equal(root.childNodes[0].attributes.length, 1);
		});

		it('should update the attribute', () => {
			RcVirtualDOM.updateElement(root, <div id="identificator"></div>);
			RcVirtualDOM.updateElement(root, <div id="newIdentificator"></div>, <div id="identificator"></div>);
			assert.equal(root.childNodes.length, 1);
			assert.equal(root.childNodes[0].getAttribute('id'), 'newIdentificator');
		});

		it('should delete the attribute', () => {
			RcVirtualDOM.updateElement(root, <div id="identificator"></div>);
			RcVirtualDOM.updateElement(root, <div></div>, <div id="identificator"></div>);
			assert.equal(root.childNodes[0].attributes.length, 0);
		});

		it('should create a child node', () => {
			RcVirtualDOM.updateElement(root, (<div></div>));
			RcVirtualDOM.updateElement(root, (<div><span></span></div>), (<div></div>));
			assert.equal(root.childNodes[0].childNodes[0].nodeName, 'SPAN');
		});

		it('should create only one child node', () => {
			RcVirtualDOM.updateElement(root, (<div></div>));
			RcVirtualDOM.updateElement(root, (<div><span></span></div>), (<div></div>));
			assert.equal(root.childNodes[0].childNodes.length, 1);
		});

		it('should update a child node', () => {
			RcVirtualDOM.updateElement(root, <div><span></span></div>);
			RcVirtualDOM.updateElement(root, <div><p></p></div>, <div><span></span></div>);
			assert.equal(root.childNodes.length, 1);
			assert.equal(root.childNodes[0].childNodes[0].nodeName, 'P');
		});

		it('should delete a child node', () => {
			RcVirtualDOM.updateElement(root, <div><span></span></div>);
			RcVirtualDOM.updateElement(root, <div></div>, <div><span></span></div>);
			assert.equal(root.childNodes[0].attributes.length, 0);
		});
	});

	describe('rCreate()', () => {
		beforeEach(() => {
		  root.innerHTML = "";
		});

		it('should create div node object', () => {
			const div = RcVirtualDOM.rCreate('div');
			assert.deepEqual(div, {type: 'div', props: {}, children: []});
		});

		it('should create div node object with props', () => {
			const div = RcVirtualDOM.rCreate('div', {className: 'container'});
			assert.deepEqual(div, {type: 'div', props: {className: 'container'}, children: []});
		});
		it('should create div node object with props & children', () => {
			const div = RcVirtualDOM.rCreate('div', {className: 'container'}, 'child1', 'child2');
			assert.deepEqual(div, {type: 'div', props: {className: 'container'}, children: ['child1', 'child2']});
		});
	});
});