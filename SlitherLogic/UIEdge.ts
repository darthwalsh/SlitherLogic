/// <reference path="lib\jquery.d.ts" />
/// <reference path="lib\kinetic.d.ts" />

class UIEdge {
  static yesWidth = 5;
  static noWidth = 2;
  static unWidth = 3;

  yesColor: string;
  static noColor = '#222';
  static unColor = 'white';

  shape: Kinetic.Line;
  edge: Edge;

  constructor(private v1: UIVertex, private v2: UIVertex) {
    this.shape = new Kinetic.Line({
      points: [0, 0],
      lineCap: 'round',
      dashArray: [1, UIEdge.unWidth * 2]
    });
    //TODO#3 hit region

    this.shape.on('click', (...evts: MouseEvent[]) => {
      var evt = evts[0];
      if (evt.which === 2) // middle
        return;

      if (this.edge.selected !== null)
        this.edge.selected = null;
      else
        this.edge.selected = evt.which === 1; // left

      return {};
    });
    Game.layer.add(this.shape);
    this.shape.setZIndex(0);

    this.yesColor = UIEdge.getRandomColor();
    this.edge = new Edge(v1.vertex, v2.vertex, () => {
      switch (this.edge.selected) {
        case true:
          this.shape.setDashArrayEnabled(false);
          this.shape.setStroke(this.yesColor);
          this.shape.setStrokeWidth(UIEdge.yesWidth);
          break;
        case false:
          this.shape.setDashArrayEnabled(false);
          this.shape.setStroke(UIEdge.noColor);
          this.shape.setStrokeWidth(UIEdge.noWidth);
          break;
        case null:
          this.shape.setDashArrayEnabled(true);
          this.shape.setStroke(UIEdge.unColor);
          this.shape.setStrokeWidth(UIEdge.unWidth);
          break;
      }
      Game.layer.draw(); //TODO#4 figure out better draw?
    });
    this.edge.updateUI();
  }

  reposition() {
    var draw1 = Game.getVirtualPoint(this.v1.p);
    var draw2 = Game.getVirtualPoint(this.v2.p);
    this.shape.setPoints([draw1.x, draw1.y, draw2.x, draw2.y]);
  }

  static getRandomColor(): string {
    //return UIEdge.rainbow(36, Math.floor(Math.random() * 36));
    return 'blue'; //TODO#5 color stuff the color of adjacent lines
    //return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  // http://blog.adamcole.ca/2011/11/simple-javascript-rainbow-color.html
  static rainbow(numOfSteps: number, step: number): string {
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch (i % 6) {
      case 0: r = 1, g = f, b = 0; break;
      case 1: r = q, g = 1, b = 0; break;
      case 2: r = 0, g = 1, b = f; break;
      case 3: r = 0, g = q, b = 1; break;
      case 4: r = f, g = 0, b = 1; break;
      case 5: r = 1, g = 0, b = q; break;
    }
    return "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
  }
}