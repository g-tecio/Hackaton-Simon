
new Vue({
  el: '#app',
  data: {
    greenActive: false,
    redActive: false,
    yellowActive: false,
    blueActive: false,

    starting: false,
    switchOn: true,
    locking: true,
    maxLevel: 15,
    count: '',
    colorsDict: {
      0: 'green',
      1: 'red',
      2: 'yellow',
      3: 'blue'
    },
    audios: [
      new Audio('asset/audios/Gato1.mp3'),
      new Audio('asset/audios/Gato2.mp3'),
      new Audio('asset/audios/Gato3.mp3'),
      new Audio('asset/audios/GatoEnojado.mp3')
    ],
    steps: [],
    playerSteps: []
  },
  methods: {
    toggleSwitch() {
      this.switchOn = !this.switchOn
      if (this.switchOn) {
        this.count = '0 0'
      } else {
      
        this.steps = []
        this.playerSteps = []
        this.count = ''
        this.locking = true
      }
    },
    
    start: _.debounce(function() {
      this.count = '0 0'
      this.steps = []
      this.playerSteps = []
      setTimeout(() => {
        this.addStep()
        this.count = this.steps.length
        this.replaySteps()
      }, 1000)
    }, 1000),
    addAndReplaySteps() {
        this.addStep()
        this.replaySteps()
    },
    addStep() {
      const index = Math.floor(Math.random() * 4)
      this.steps.push(index)
    },
    justPlayAudio(index){
      this.audios[index].play()
      const color = this.colorsDict[index]
      const activeClass = `${color}Active`
      this[activeClass] = true
      setTimeout(() => {
        this[activeClass] = false
      }, 700)
    },
    playAudio(index) {
      if (this.locking || !this.switchOn || this.steps.length == this.playerSteps.length) {
        return
      }
      this.audios[index].play()
      this.playerSteps.push(index)
      const latestStep = this.steps[this.steps.length - 1]
      const latestIndex = this.playerSteps.length - 1
      
      if (this.steps[latestIndex] != index) {
       
        this.count = 'Again!'
       
          setTimeout(this.replaySteps, 1000)
        
        return
      }
      
  
      if (this.steps.length == this.playerSteps.length) {
        if (this.count == this.maxLevel) {
          this.count = 'END'
          setTimeout(this.start, 2000)
          return
        }
        setTimeout(() => {
          this.count++
          this.addAndReplaySteps()
        }, 1000)
      }
    },
    replaySteps() {
      this.playerSteps = []
      this.count = this.steps.length
      this.locking = true
      this.steps.forEach((value, index) => {
        setTimeout(() => {
          this.justPlayAudio(value)
          if (index == this.steps.length - 1) {
              setTimeout(() => {
                this.locking = false
              }, 2000) 
          }
        }, 1000 * (index+1))
      })
    },
    
  }
})