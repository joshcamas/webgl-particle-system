class Input
{
    constructor(canvas)
    {
        this.lastMousePosition = [0, 0]
        this.dragging = false
        this.canvas = canvas;
        this.rx = 0;
        this.ry = 0;
        this.zoom = 10;
        
        this.setupControls();
    }

    setupControls()
    {
        var _this = this;

        canvas.addEventListener('mousedown', (e) => {_this.onMouseDown(e)}, false)
        canvas.addEventListener('wheel', (e) => {_this.onWheel(e)},false);
        window.addEventListener('mousemove', (e) => {_this.onMouseMove(e)}, false)
        window.addEventListener('mouseup', (e) => {_this.onMouseUp(e)}, false)
    }
    
    getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        return [x,y];
    }
    
    onWheel(e)
    {
        this.zoom += e.deltaY*0.1 ;
    
        if(this.zoom < 0.1)
        this.zoom = 0.1;
    }
    
    onMouseDown(e)
    {
        this.lastMousePosition = this.getCursorPosition(this.canvas,e);
        this.dragging = true
    }
    
    onMouseUp(e)
    {
        this.dragging = false
    }
    
    onMouseMove(e)
    {
        if(this.dragging == false)
            return;
    
        var newMousePosition = this.getCursorPosition(this.canvas,e);
        var dx = newMousePosition[0] - this.lastMousePosition[0];
        var dy = newMousePosition[1] - this.lastMousePosition[1];
    
        this.rx -= dx*0.005;
        this.ry += dy*0.001;
        this.lastMousePosition = newMousePosition;
    }
    
}