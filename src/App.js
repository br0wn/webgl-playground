import React, {Component} from 'react';

class App extends Component {

    constructor(props) {
        super(props);

        /**
         * @type {null | HTMLCanvasElement}
         */
        this.canvas = null;
        this.canvasRef = React.createRef();
        /**
         *
         * @type {null | WebGLRenderingContext}
         */
        this.drawingContext = null;

        this.isDrawing = false;
        this.isLoopActive = false;

        this.color = [0, 0, 0];

        this.state = {
            error: null
        };
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;

        if (!this.canvas) {
            this.setState({error: "Canvas not present"});
            return;
        }

        this.drawingContext = this.canvas.getContext("webgl");

        if (!this.drawingContext) {
            this.setState({error: "WebGL not supported"});
            return;
        }
    }

    start = () => {
        this.isLoopActive = true;
        this.loop();
        this.forceUpdate();
    };

    stop = () => {
        this.isLoopActive = false;
        this.forceUpdate();
    };

    loop = (time) => {
        if (!this.isLoopActive) {
            return;
        }

        window.requestAnimationFrame(this.loop);

        if (!this.isDrawing) {
            this.isDrawing = true;

            this.draw(time);

            this.isDrawing = false;
        }
    };

    updateColor = (time) => {
        const k = Math.floor(time / 10);
        const color = this.color;

        color[0] = k % 256;
        color[1] = Math.floor(k / 256) % 256;
        color[2] = Math.floor(k / (256 * 256)) % 256;
    };

    draw = (time) => {
        this.updateColor(time);

        const color = this.color;
        const gl = this.drawingContext;

        console.log(color);

        // Set clear color to black, fully opaque
        gl.clearColor(color[0], color[1], color[2], 1.0);
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT);
    };

    render() {
        const isDisabled = !!this.state.error;

        return (
            <div>
                <div>
                    <button disabled={isDisabled} type="button" onClick={this.start}>Start</button>
                    <button disabled={isDisabled} type="button" onClick={this.stop}>Stop</button>
                </div>

                {!!this.state.error && (
                    <p style={{color: 'red'}}>{this.state.error}</p>
                )}

                {this.isLoopActive && (
                    <p style={{color: 'green'}}>Running...</p>
                )}

                <canvas ref={this.canvasRef} width={800} height={600}/>
            </div>
        );
    }

}

export default App;
