export class Colors {
  colorList = [
    'RED',
    'BLUE',
    'GREEN',
    'YELLOW',
    'PURPLE',
    'ORANGE',
    'WHITE',
    'BLACK',
    'GREY'
  ];

  colorValueMap = {
    RED: '#ff0000',
    BLUE: '#0000ff',
    GREEN: '#008000',
    YELLOW: '#ffff00',
    PURPLE: '#800080',
    ORANGE: '#ffa500',
    WHITE: '#ffffff',
    BLACK: '#000000',
    GREY: '#808080'
  };

  defaultColor = this.colorValueMap.BLACK;
}
