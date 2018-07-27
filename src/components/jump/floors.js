export default {
  data(){
    return{
      allData: [
        {},
        {
          level: 1,
          bornLeft: 100,
          bornBottom: 800,
          floors: [
            {
              width: 150,
              height: 10,
              top: 700,
              left: 550,
              events: "",
            },
            {
              width: 100,
              height: 10,
              top: 600,
              left: 400,
              events: "",
            },
            {
              width: 80,
              height: 10,
              top: 500,
              left: 700,
              events: "",
            },
            {
              width: 150,
              height: 10,
              top: 450,
              left: 100,
              events: "",
            },
            {
              width: 70,
              height: 10,
              top: 350,
              left: 500,
              events: "",
            },
            {
              width: 60,
              height: 10,
              top: 300,
              left: 850,
              events: "",
            },
            {
              width: 50,
              height: 10,
              top: 180,
              left: 855,
              events: "",
            },
            {
              width: 40,
              height: 10,
              top: 100,
              left: 650,
              events: "",
            },
            {
              width: 30,
              height: 10,
              top: 200,
              left: 320,
              events: "",
            },
            {
              width: 30,
              height: 10,
              top: 120,
              left: 130,
              color: "green",
              events: "level2",
            }
          ]
        },
        {
          level: 2,
          bornLeft: 20,
          bornBottom: 50,
          floors: [
            {
              width: 50,
              height: 10,
              top: 50,
              left: 0,
              events: "",
            },
            {
              width: 400,
              height: 10,
              top: 60,
              left: 0,
              events: "slideRight",
            },
            {
              width: 10,
              height: 260,
              top: 0,
              left: 450,
              events: "",
            },
            {
              width: 10,
              height: 190,
              top: 70,
              left: 420,
              events: "",
            },
            {
              width: 40,
              height: 10,
              top: 260,
              left: 420,
              color: "red",
              events: "die",
            }
          ]
        }
      ]
    }
  }
};
