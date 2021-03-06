local GameUnit = class("GameUnit", function()
	return display.newNode()
end)
local scheduler = import("framework.scheduler")
local Progress = import("app.views.Progress")

function GameUnit:ctor(hero)
	-- body
	local clas = hero.class
	cc.EventProxy.new(hero, self)
		:addEventListener(clas.CHANGE_STATE_EVENT, handler(self, self.onStateChange))
		:addEventListener(clas.KILL_EVENT, handler(self, self.onKilled))
		:addEventListener(clas.HP_CHANGED_EVENT, handler(self, self.onHpChanged))
		:addEventListener(clas.EXP_CHANGED_EVENT, handler(self, self.onExpChanged))

	self.player = hero
	self:initDisplay()
end

function GameUnit:onStateChange( event )
	self:updateShapeDisplay(self.player:getState())
end

--更新角色显示{"anim_walk","anim_eat","anim_placeladder","anim_idle","anim_ladderwalk","anim_laddereat","anim_death"}
function GameUnit:updateShapeDisplay(state)
	local animname = "anim_idle"
	if state == "walking" then
		animname = "anim_walk"
	elseif state == "firing" then
		animname = "anim_eat"
	elseif state == "dead" then
		animname = "anim_death"
	end
    --printInfo("GameUnit state changed to %s playing : %s", state, animname)
	if self.shape ~= nil then
		local animation = self.shape:getAnimation()
		animation:setSpeedScale(0.4)
		animation:play(animname)
	    
	    self:setPosition(self.player:getX(), self.player:getY())
    	self:setScaleX(self.player:getDirection())
	end
end

function GameUnit:onKilled( event)
	scheduler.performWithDelayGlobal(handler(self, self.autoRemove), 1.5)
end

function GameUnit:onHpChanged( event )
	self.hpbar:setProgress(self.player:getHp()/self.player:getMaxHp() * 100)
	
end

function GameUnit:autoRemove()
	local action = cc.FadeTo:create(1.0, 0.0)
	transition.execute(self.shape, action, {
		onComplete = function( )
			self:removeSelf()
		end
		})
end

function GameUnit:onExpChanged( event )
	-- body
end

--初始化显示
function GameUnit:initDisplay()
	-- 角色外观
	--[[
    armature:getAnimation():playWithIndex(1)
    armature:getAnimation():setSpeedScale(0.5)
    armature:setPosition(cc.p(display.cx,display.cy*0.3))
    armature:setScale(0.6)
    ]]
    
	local shape = ccs.Armature:create(self.player:getRes())
	self.shape = shape
   	self:updateShapeDisplay(self.player:getState())
   	shape:setAnchorPoint(CCPoint(0.5,0))
   	self:addChild(shape)
	--角色血条
	self.hpbar = Progress.new("progres_bg.png","progress.png")
	self.hpbar:pos(0.5, shape:getContentSize().height)
	self:addChild(self.hpbar)
end
--传入|更新数据
function GameUnit:setData()
	-- body
end
--取得数据
function GameUnit:getData()
	return self.player
end
--添加事件:重复利用这个对象的时候会用到
function GameUnit:addEvents()
	-- body
end
--移除事件:重复利用这个对象的时候会用到
function GameUnit:removeEvents()
	-- body
end

function GameUnit:onExit()
	super.onExit()
end

return GameUnit