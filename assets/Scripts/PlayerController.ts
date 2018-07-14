import GameController from './GameController';

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerController extends cc.Component {
    @property
    public HorizontalSpeed: number = 0;

    @property
    public MaxHorizontalPosition: number = 0;

    @property
    public MinHorizontalPosition: number = 0;

    @property({ type: cc.Node })
    public MainGameController: GameController = null;

    private _isMovingLeft: boolean;
    private _isMovingRight: boolean;

    public onLoad(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.OnKeyUp, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_START, event => {
            let xPosition: number = (event as any).getLocationX();
            if (xPosition < this.node.parent.width / 2) {
                this._isMovingLeft = true;
            } else { this._isMovingRight = true; }
        }, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, event => {
            let xPosition: number = (event as any).getLocationX();
            if (xPosition < this.node.parent.width / 2) {
                this._isMovingLeft = false;
            } else { this._isMovingRight = false; }
        }, this);
    }

    public update(dt: number): void {
        let positionX: number = this.node.getPositionX();
        if (this._isMovingLeft) {
            positionX -= this.HorizontalSpeed * dt;
        }
        if (this._isMovingRight) {
            positionX += this.HorizontalSpeed * dt;
        }

        positionX = Math.min(this.MaxHorizontalPosition, positionX);
        positionX = Math.max(this.MinHorizontalPosition, positionX);

        this.node.setPositionX(positionX);
    }

    public onCollisionEnter(): void {
        (this.MainGameController.getComponent('GameController') as GameController).GameOver();
    }

    private OnKeyDown(event: cc.Event.EventCustom): void {
        switch (event.keyCode) {
            case cc.KEY.a:
                this._isMovingLeft = true;
                break;
            case cc.KEY.d:
                this._isMovingRight = true;
                break;
        }
    }

    private OnKeyUp(event: cc.Event.EventCustom): void {
        switch (event.keyCode) {
            case cc.KEY.a:
                this._isMovingLeft = false;
                break;
            case cc.KEY.d:
                this._isMovingRight = false;
                break;
        }
    }
}
