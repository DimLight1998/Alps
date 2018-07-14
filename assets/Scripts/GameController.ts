import PlayerController from './PlayerController';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {
    @property({ type: cc.Prefab })
    public TreePrefab: cc.Prefab = null;

    @property({ type: cc.Node })
    public Player: cc.Node = null;

    @property
    public BasePlayerVerticalSpeed: number = 0;

    @property
    public InitMinTreeGenerationTime: number = 0;

    @property
    public InitMaxTreeGenerationTime: number = 0;

    @property
    public MaxTreeGenerationNumAtSameTime: number = 5;

    private _trees: Array<cc.Node> = new Array<cc.Node>();
    private _treeGenerationDownCount: number = 0;
    private _playerVerticalSpeed: number = this.BasePlayerVerticalSpeed;
    private _gamingTime: number = 0;
    private _score: number = 0;

    public onLoad(): void {
        let manager: cc.CollisionManager = cc.director.getCollisionManager();
        manager.enabled = true;
    }

    public update(dt: number): void {
        for (let i: number = this._trees.length - 1; i >= 0; i--) {
            if (this._trees[i].getPositionY() > 0.5 * this.node.height + 100) {
                this._trees[i].destroy();
                this._trees.splice(i, 1);
            } else {
                this._trees[i].setPositionY(this._trees[i].getPositionY() + this._playerVerticalSpeed * dt);
            }
        }

        this._treeGenerationDownCount -= dt;
        if (this._treeGenerationDownCount < 0) {
            this._treeGenerationDownCount =
                (this.InitMinTreeGenerationTime +
                    cc.random0To1() * (this.InitMaxTreeGenerationTime - this.InitMinTreeGenerationTime)
                ) * (0.5 + 0.5 * Math.exp(- 0.01 * this._gamingTime));

            let playerController: PlayerController = this.Player.getComponent('PlayerController') as PlayerController;

            for (let i: number = 0; i < Math.min(1, cc.random0To1() * this.MaxTreeGenerationNumAtSameTime); i++) {
                let positionX: number = playerController.MinHorizontalPosition +
                    cc.random0To1() * (playerController.MaxHorizontalPosition - playerController.MinHorizontalPosition);
                let positionY: number = -0.5 * this.node.height - cc.random0To1() * 100 - 100;
                let newTree: cc.Node = cc.instantiate(this.TreePrefab);
                newTree.setPosition(positionX, positionY);
                this._trees.push(newTree);
                this.node.addChild(newTree);
            }
        }

        this._gamingTime += dt;
        this._playerVerticalSpeed = this.BasePlayerVerticalSpeed * (1 + Math.log(1 + this._gamingTime));
        this._score = Math.round(this._gamingTime * (1 + 0.1 * this._gamingTime));

        (this.node.getChildByName('ScoreDisplay').getComponent(cc.Label) as cc.Label).string =
            `Score: ${this._score}`;
    }

    public GameOver(): void {
        console.log('game over!');
        cc.director.loadScene('Main');
    }
}
