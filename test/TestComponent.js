import {RcVirtualDOM, RComponent} from '../src/RcVue';

class TestComponent extends RComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="testComponent">
				testComponent
			</div>
		);
	}
}

export default TestComponent;