/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class Main extends egret.DisplayObjectContainer{

    /**
     * 加载进度界面
     */
    private loadingView:LoadingUI;
    private stones:Array;
    private plate:egret.Bitmap;
    private txt:egret.TextField;
    private selectedStone:Stone;
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        //设置加载进度界面
        this.loadingView  = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void{
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            this.createGameScene();
        }
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }

    private textContainer:egret.Sprite;
    /**
     * 创建游戏场景
     */
    private createGameScene():void{
        this.txt = new egret.TextField();
        this.addChild(this.txt);
        this.txt.width = this.stage.stageWidth;
        this.txt.height = 100;
        this.plate = this.createBitmapByName("plate");
        this.addChild(this.plate);
        this.plate.x = this.stage.stageWidth - this.plate.width >> 1;
        this.plate.y = (this.stage.stageHeight - this.plate.height) >> 1;
        this.plate.touchEnabled = true;
        this.plate.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBgTouched,this);
        this.initStones();
        /**
        var sky:egret.Bitmap = this.createBitmapByName("bgImage");
        this.addChild(sky);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        var topMask:egret.Shape = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, stageH);
        topMask.graphics.endFill();
        topMask.width = stageW;
        topMask.height = stageH;
        this.addChild(topMask);

        var icon:egret.Bitmap = this.createBitmapByName("egretIcon");
        icon.anchorX = icon.anchorY = 0.5;
        this.addChild(icon);
        icon.x = stageW / 2;
        icon.y = stageH / 2 - 60;
        icon.scaleX = 0.55;
        icon.scaleY = 0.55;

        var colorLabel:egret.TextField = new egret.TextField();
        colorLabel.x = stageW / 2;
        colorLabel.y = stageH / 2 + 50;
        colorLabel.anchorX = colorLabel.anchorY = 0.5;
        colorLabel.textColor = 0xffffff;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 20;
        this.addChild(colorLabel);

        var textContainer:egret.Sprite = new egret.Sprite();
        textContainer.anchorX = textContainer.anchorY = 0.5;
        this.addChild(textContainer);
        textContainer.x = stageW / 2;
        textContainer.y = stageH / 2 + 100;
        textContainer.alpha = 0;

        this.textContainer = textContainer;

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        RES.getResAsync("description",this.startAnimation,this)
         */
    }

    private initStones():void
    {
        this.stones = [];
        Config.StartX = this.plate.x + (Config.Unit >> 1);
        Config.StartY = this.plate.y + (Config.Unit >> 1) + 2;
        var len:number = Config.StoneConfig.length;
        for(var i:number = 0; i < len; i++)
        {
            var info = Config.StoneConfig[i];
            var stone:Stone = new Stone(info["isRed"]);
            stone.setType(info["type"]);
            stone.setPos(info["posX"],info["posY"]);
            stone.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouched, this);
            this.addChild(stone);
            this.stones.push(stone);
        }
    }

    private getStoneAt(posx:number, posy:number):Stone
    {
        var len:number = this.stones.length;
        for(var i:number; i < len; i++)
        {
            var s:Stone = this.stones[i];
            if(s.getTx() == posx && s.getTy() == posy)
            {
                break;
            }
        }
        return s;
    }

    private onBgTouched(event:egret.TouchEvent):void
    {
        var posX:number = event.stageX;
        var posY:number = event.stageY;
        var tx:number = parseInt((posX - Config.StartX)/Config.Unit);
        var ty:number = parseInt((posY - Config.StartY)/Config.Unit);
        var s:Stone = this.getStoneAt(tx, ty);
        if(this.selectedStone) //todo then move
            var canMove:boolean = this.canMoveTo(this.selectedStone,tx,ty);
        if(s != null)
        {
            //todo do kill
        }else
        {
            //todo do move
        }
    }
    private onTouched(event:egret.TouchEvent):void
    {
        var stone:Stone = event.currentTarget;
        this.txt.text = "Type:"+stone.getType()+" Name:"+stone.name;
        if(stone.isRed() == Config.IsRed )
        {
            this.selectedStone = event.target;
            return;
        }else
        {
            if(this.selectedStone != null)
            {
               var canMove:boolean = this.canMoveTo(stone,stone.getTx(),stone.getTy());
                //todo then kill
            }
        }
    }

    private canMoveTo(stone:Stone,tx:number,ty:number):boolean
    {
        var result:boolean = false;
        switch(stone.getType())
        {
            case EnumStoneType.TypeBing:
                result = this.canMoveBing(stone,tx,ty);
                break;
            case EnumStoneType.TypeChe:
                result = this.canMoveChe(stone,tx,ty);
                break;
            case EnumStoneType.TypeMa:
                result = this.canMoveMa(stone,tx,ty);
                break;
            case EnumStoneType.TypePao:
                result = this.canMovePao(stone,tx,ty);
                break;
            case EnumStoneType.TypeShi:
                result = this.canMoveShi(stone,tx,ty);
                break;
            case EnumStoneType.TypeXiang:
                result = this.canMoveXiang(stone,tx,ty);
                break;
            case EnumStoneType.TypeShuai:
                result = this.canMoveShuai(stone,tx,ty);
                break;
        }
        return result;
    }

    private canMoveBing(stone:Stone,tx:number,ty:number):boolean
    {
        return true;
    }

    private canMoveChe(stone:Stone,tx:number,ty:number):boolean
    {
        return true;
    }

    private canMoveMa(stone:Stone,tx:number,ty:number):boolean
    {
        return true;
    }
    private canMovePao(stone:Stone,tx:number,ty:number):boolean
    {
        return true;
    }
    private canMoveXiang(stone:Stone,tx:number,ty:number):boolean
    {
        return true;
    }
    private canMoveShi(stone:Stone,tx:number,ty:number):boolean
    {
        return true;
    }
    private canMoveShuai(stone:Stone,tx:number,ty:number):boolean
    {
        return true;
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     */
    private startAnimation(result:Array<any>):void{
        var textContainer:egret.Sprite = this.textContainer;
        var count:number = -1;
        var self:any = this;
        var change:Function = function() {
            count++;
            if (count >= result.length) {
                count = 0;
            }
            var lineArr = result[count];

            self.changeDescription(textContainer, lineArr);

            var tw = egret.Tween.get(textContainer);
            tw.to({"alpha":1}, 200);
            tw.wait(2000);
            tw.to({"alpha":0}, 200);
            tw.call(change, this);
        }

        change();
    }
    /**
     * 切换描述内容
     */
    private changeDescription(textContainer:egret.Sprite, lineArr:Array<any>):void {
        textContainer.removeChildren();
        var w:number = 0;
        for (var i:number = 0; i < lineArr.length; i++) {
            var info:any = lineArr[i];
            var colorLabel:egret.TextField = new egret.TextField();
            colorLabel.x = w;
            colorLabel.anchorX = colorLabel.anchorY = 0;
            colorLabel.textColor = parseInt(info["textColor"]);
            colorLabel.text = info["text"];
            colorLabel.size = 40;
            textContainer.addChild(colorLabel);

            w += colorLabel.width;
        }
    }
}


