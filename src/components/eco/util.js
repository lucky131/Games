export default {
  data(){
    return{

    }
  },
  methods: {
    linearColorRGB(x1,r1,g1,b1,x2,r2,g2,b2,x,gap=1) {
      let rgb = {};
      gap = gap<1 ? 1 : gap;
      x = x-x%gap;
      rgb.r = Math.floor((r2-r1)/(x2-x1)*x+(r1*x2-r2*x1)/(x2-x1));
      rgb.g = Math.floor((g2-g1)/(x2-x1)*x+(g1*x2-g2*x1)/(x2-x1));
      rgb.b = Math.floor((b2-b1)/(x2-x1)*x+(b1*x2-b2*x1)/(x2-x1));
      return rgb;
    },
    inverseColorRGB(x1,r1,g1,b1,r2,g2,b2,flag,x,gap=1) {
      let rgb = {};
      gap = gap<1 ? 1 : gap;
      x = x-x%gap;
      rgb.r = Math.floor(r2-x1*(r2-r1)/((x-x1)/flag+x1));
      rgb.g = Math.floor(g2-x1*(g2-g1)/((x-x1)/flag+x1))
      rgb.b = Math.floor(b2-x1*(b2-b1)/((x-x1)/flag+x1));
      return rgb;
    },
    cosOfTwoVector(x1,y1,x2,y2) {
      let zi = x1*x2+y1*y2;
      let mu = Math.sqrt((x1*x1+y1*y1)*(x2*x2+y2*y2));
      return zi/mu;
    }
  }
};
