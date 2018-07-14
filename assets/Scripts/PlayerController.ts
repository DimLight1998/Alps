const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerController extends cc.Component {
    @property
    public HorizontalSpeed: number = 0;

    @property
    public MaxHorizontalPosition: number = 0;

    @property
    public MinHorizontalPosition: number = 0;

    private _isMovingLeft: boolean;
    private _isMovingRight: boolean;

    public onLoad(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.OnKeyUp, this);
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
