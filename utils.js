class Message{
  constructor(action,time=undefined){
    this.action=action;
    this.time=time;
  }

}
module.exports = Message;