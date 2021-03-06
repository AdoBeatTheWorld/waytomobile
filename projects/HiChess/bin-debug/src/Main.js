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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    };
    /**
     * preload资源组加载进度
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     */
    Main.prototype.createGameScene = function () {
        this.txt = new egret.TextField();
        this.addChild(this.txt);
        this.txt.width = this.stage.stageWidth;
        this.txt.height = 100;
        this.plate = this.createBitmapByName("plate");
        this.addChild(this.plate);
        this.plate.x = this.stage.stageWidth - this.plate.width >> 1;
        this.plate.y = (this.stage.stageHeight - this.plate.height) >> 1;
        this.plate.touchEnabled = true;
        this.plate.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBgTouched);
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
    };
    Main.prototype.initStones = function () {
        this.stones = [];
        Config.StartX = this.plate.x + (Config.Unit >> 1);
        Config.StartY = this.plate.y + (Config.Unit >> 1) + 2;
        var len = Config.StoneConfig.length;
        for (var i = 0; i < len; i++) {
            var info = Config.StoneConfig[i];
            var stone = new Stone(info["isRed"]);
            stone.setType(info["type"]);
            stone.setPos(info["posX"], info["posY"]);
            stone.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouched, this);
            this.addChild(stone);
            this.stones.push(stone);
        }
    };
    Main.prototype.onBgTouched = function (event) {
        var posX = event.stageX;
        var posY = event.stageY;
        var tx = parseInt((posX - Config.StartX) / Config.Unit);
        var ty = parseInt((posY - Config.StartY) / Config.Unit);
        alert(tx + ":" + ty);
    };
    Main.prototype.onTouched = function (event) {
        var stone = event.currentTarget;
        this.txt.text = "Type:" + stone.getType() + " Name:" + stone.name;
        if (stone.isRed() == Config.IsRed) {
            this.selectedStone = event.target;
            return;
        }
        else {
            if (this.selectedStone != null) {
            }
        }
    };
    Main.prototype.canMoveTo = function (stone, tx, ty) {
        var result = false;
        switch (stone.getType()) {
            case EnumStoneType.TypeBing:
                result = this.canMoveBing(stone, tx, ty);
                break;
            case EnumStoneType.TypeChe:
                result = this.canMoveChe(stone, tx, ty);
                break;
            case EnumStoneType.TypeMa:
                result = this.canMoveMa(stone, tx, ty);
                break;
            case EnumStoneType.TypePao:
                result = this.canMovePao(stone, tx, ty);
                break;
            case EnumStoneType.TypeShi:
                result = this.canMoveShi(stone, tx, ty);
                break;
            case EnumStoneType.TypeXiang:
                result = this.canMoveXiang(stone, tx, ty);
                break;
            case EnumStoneType.TypeShuai:
                result = this.canMoveShuai(stone, tx, ty);
                break;
        }
        return result;
    };
    Main.prototype.canMoveBing = function (stone, tx, ty) {
        return true;
    };
    Main.prototype.canMoveChe = function (stone, tx, ty) {
        return true;
    };
    Main.prototype.canMoveMa = function (stone, tx, ty) {
        return true;
    };
    Main.prototype.canMovePao = function (stone, tx, ty) {
        return true;
    };
    Main.prototype.canMoveXiang = function (stone, tx, ty) {
        return true;
    };
    Main.prototype.canMoveShi = function (stone, tx, ty) {
        return true;
    };
    Main.prototype.canMoveShuai = function (stone, tx, ty) {
        return true;
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     */
    Main.prototype.startAnimation = function (result) {
        var textContainer = this.textContainer;
        var count = -1;
        var self = this;
        var change = function () {
            count++;
            if (count >= result.length) {
                count = 0;
            }
            var lineArr = result[count];
            self.changeDescription(textContainer, lineArr);
            var tw = egret.Tween.get(textContainer);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };
        change();
    };
    /**
     * 切换描述内容
     */
    Main.prototype.changeDescription = function (textContainer, lineArr) {
        textContainer.removeChildren();
        var w = 0;
        for (var i = 0; i < lineArr.length; i++) {
            var info = lineArr[i];
            var colorLabel = new egret.TextField();
            colorLabel.x = w;
            colorLabel.anchorX = colorLabel.anchorY = 0;
            colorLabel.textColor = parseInt(info["textColor"]);
            colorLabel.text = info["text"];
            colorLabel.size = 40;
            textContainer.addChild(colorLabel);
            w += colorLabel.width;
        }
    };
    return Main;
})(egret.DisplayObjectContainer);
Main.prototype.__class__ = "Main";
