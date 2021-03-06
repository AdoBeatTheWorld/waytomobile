﻿//
//  GameMenuScene.h
//  example12-1
//
//  Created by shuoquan man on 12-10-13.
//  Copyright (c) 2012年 __MyCompanyName__. All rights reserved.
//

#ifndef example15_1_GameMenuScene_h
#define example15_1_GameMenuScene_h

#include "cocos2d.h"
using namespace cocos2d;
class GameMenu : public cocos2d::Layer
{
public:
    bool issound;
    
    MenuItemImage *soundItem;
    
    virtual bool init();
    
    virtual void onEnter();
    
    virtual void onExit();
    
    static cocos2d::Scene* createScene();
    
	void menuEnter(Node* node);
    
	void menuNewGameCallback(Ref* pSender);
    
    void menuContinueCallback(Ref* pSender);
    
    void menuAboutCallback(Ref* pSender);
    
    void menuSoundCallback(Ref* pSender);
    
    CREATE_FUNC(GameMenu);
    
    void onEnterTransitionDidFinish();
    
    void onExitTransitionDidStart();

	virtual bool onTouchBegan(Touch *touch, Event *event);
	virtual void onTouchMoved(Touch *touch, Event *event);
	virtual void onTouchEnded(Touch *touch, Event *event);
	virtual void onTouchCancelled(Touch *touch, Event *event);
};

#endif
