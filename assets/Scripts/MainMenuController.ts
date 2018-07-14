const { ccclass, property } = cc._decorator;

@ccclass
export default class MainMenuController extends cc.Component {
    public onLoad(): void {
        let button: cc.Node = this.node.getChildByName('StartButton');
        button.on('click', () => { cc.director.loadScene('Main'); });
    }
}
