class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
      if (!config) {
        this.initial = config.initial;
        this.states = config.states;
        this.state = config.initial;
      } else {
        this.initial = this.state = 'normal';
        this.states = {
                normal: {
                    transitions: {
                        study: 'busy',
                    }
                },
                busy: {
                    transitions: {
                        get_tired: 'sleeping',
                        get_hungry: 'hungry',
                    }
                },
                hungry: {
                    transitions: {
                        eat: 'normal'
                    },
                },
                sleeping: {
                    transitions: {
                        get_hungry: 'hungry',
                        get_up: 'normal',
                    },
                },
            };
      };
      this.history = new Array();
      this.historyTree = new Array(); //copy of history
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
      return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
      if (state=='normal' || state=='busy' || state=='sleeping' || state=='hungry') {
      //try {
        this.state = state;
        this.history.push(state);
        var stepsForth = this.historyTree.length - this.history.length;
        if (stepsForth>0) {this.historyTree = this.history;} else {this.historyTree.push(this.state);}
      //}
      } else {
      //catch(err) {
        throw new Error('No such state');
      }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var stepsForth;
        console.log("!!!!!!" + this.history + " " + this.historyTree);
        switch (event) {
          case 'study':
              if (this.state=='normal') { this.state="busy"; this.history.push(this.state); stepsForth = this.historyTree.length - this.history.length; if (stepsForth>0) {this.historyTree = this.history;} else {this.historyTree.push(this.state);} break;}
              //break;
          case 'get_tired':
              if (this.state=='busy') { this.state="sleeping"; this.history.push(this.state); stepsForth = this.historyTree.length - this.history.length; if (stepsForth>0) {this.historyTree = this.history;} else {this.historyTree.push(this.state);} break;}
              //break;
          case 'get_hungry':
              if (this.state=='busy' || this.state=='sleeping') { this.state="hungry"; this.history.push(this.state); stepsForth = this.historyTree.length - this.history.length; if (stepsForth>0) {this.historyTree = this.history;} else {this.historyTree.push(this.state);} break;}
              //break;
          case 'get_up':
              if (this.state=='sleeping') { this.state="normal"; this.history.push(this.state); stepsForth = this.historyTree.length - this.history.length; if (stepsForth>0) {this.historyTree = this.history;} else {this.historyTree.push(this.state);} break;}
              //break;
          case 'eat':
              if (this.state=='hungry') { this.state="normal"; this.history.push(this.state); stepsForth = this.historyTree.length - this.history.length; if (stepsForth>0) {this.historyTree = this.history;} else {this.historyTree.push(this.state);} break;}
              //break;
          default:
              throw new Error('No such event');
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
      this.state = this.initial;
      this.history = new Array();
      this.historyTree = new Array();
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
      var statesArray = new Array();
      if (event=="" || event == null || event == undefined ) {
          statesArray = new Array('normal','busy','hungry','sleeping');
      } else {
          if (event=='study') {statesArray = new Array('normal');}
          if (event=='eat') {statesArray = new Array('hungry');}
          if (event=='get_tired') {statesArray = new Array('busy');}
          if (event=='get_up') {statesArray = new Array('sleeping');}
          if (event=='get_hungry') {statesArray = new Array('busy','sleeping');}
      }
      return statesArray;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      console.log("HIST: " + this.history);
      console.log("TREE: " + this.historyTree);

      if (this.history.length>0) {
        this.history.pop();
        if (this.history.length == 0) {
          this.state = this.initial;
        } else {
            this.state = this.historyTree[this.history.length];
        }
        return true;
      } else {
        return false;
      }
      console.log("HIST: " + this.history);
      console.log("TREE: " + this.historyTree);
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      var stepsForth = this.historyTree.length - this.history.length;
      if (stepsForth>0) {
        this.state = this.historyTree[this.history.length];
        this.history.push(this.historyTree[this.history.length]);
        return true;
      } else {
        return false;
      }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this.history = new Array();
      this.historyTree = new Array();
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
