//=============================================================================
// ControlNF.js
// ----------------------------------------------------------------------------
// Copyright (c) 2018 nomaldog
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/10/12 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/nomaldog/
//=============================================================================

/*:ja
 * @plugindesc NightFlight専用プラグインという名のライブラリ
 * @author nomaldog
 *
 * @help
 * 
 * 愉快なプラグインコマンドたち
 * 
 * "ControlNF Control"：あやつる判定
 * "AllCharactorMove"：全キャラ1回行動
 * "Trap"：罠起動を一通り精査します。
 * "EnemyEventIdUpdate"：戦闘する敵エネミーIDをプログラム内変数に設定します。
 * "EnemyHpReflect"：戦闘する敵エネミーのHPを、罠等で減っている分補正します。
 * 
 */
(function() {
    /* カナ入力のみにする */
    Window_NameInput.JAPAN1 =
            [ 'ア','イ','ウ','エ','オ',  'ガ','ギ','グ','ゲ','ゴ',
              'カ','キ','ク','ケ','コ',  'ザ','ジ','ズ','ゼ','ゾ',
              'サ','シ','ス','セ','ソ',  'ダ','ヂ','ヅ','デ','ド',
              'タ','チ','ツ','テ','ト',  'バ','ビ','ブ','ベ','ボ',
              'ナ','ニ','ヌ','ネ','ノ',  'パ','ピ','プ','ペ','ポ',
              'ハ','ヒ','フ','ヘ','ホ',  'ァ','ィ','ゥ','ェ','ォ',
              'マ','ミ','ム','メ','モ',  'ッ','ャ','ュ','ョ','ヮ',
              'ヤ','ユ','ヨ','ワ','ン',  'ー','～','・','＝','☆',
              'ラ','リ','ル','レ','ロ',  'ヴ','ヲ','　','カナ','決定' ];
    Window_NameInput.JAPAN2 =
            [ 'ア','イ','ウ','エ','オ',  'ガ','ギ','グ','ゲ','ゴ',
              'カ','キ','ク','ケ','コ',  'ザ','ジ','ズ','ゼ','ゾ',
              'サ','シ','ス','セ','ソ',  'ダ','ヂ','ヅ','デ','ド',
              'タ','チ','ツ','テ','ト',  'バ','ビ','ブ','ベ','ボ',
              'ナ','ニ','ヌ','ネ','ノ',  'パ','ピ','プ','ペ','ポ',
              'ハ','ヒ','フ','ヘ','ホ',  'ァ','ィ','ゥ','ェ','ォ',
              'マ','ミ','ム','メ','モ',  'ッ','ャ','ュ','ョ','ヮ',
              'ヤ','ユ','ヨ','ワ','ン',  'ー','～','・','＝','☆',
              'ラ','リ','ル','レ','ロ',  'ヴ','ヲ','　','カナ','決定' ];
    Window_NameInput.JAPAN3 =
            [ 'ア','イ','ウ','エ','オ',  'ガ','ギ','グ','ゲ','ゴ',
              'カ','キ','ク','ケ','コ',  'ザ','ジ','ズ','ゼ','ゾ',
              'サ','シ','ス','セ','ソ',  'ダ','ヂ','ヅ','デ','ド',
              'タ','チ','ツ','テ','ト',  'バ','ビ','ブ','ベ','ボ',
              'ナ','ニ','ヌ','ネ','ノ',  'パ','ピ','プ','ペ','ポ',
              'ハ','ヒ','フ','ヘ','ホ',  'ァ','ィ','ゥ','ェ','ォ',
              'マ','ミ','ム','メ','モ',  'ッ','ャ','ュ','ョ','ヮ',
              'ヤ','ユ','ヨ','ワ','ン',  'ー','～','・','＝','☆',
              'ラ','リ','ル','レ','ロ',  'ヴ','ヲ','　','カナ','決定' ];
    /* スペースキーの独立化 */
    Input.keyMapper[32] = 'space';
    
    /* 暗闇描画用 */
    var diffDark = 0;
    var plusDark = true;
    var waitDark = 0;
    
    /* ダンジョン画面 パペット描画用 */
    var movePapet = 0;

    /* ゲームオーバー画面用 */
    var efCount  = 0;
    var bgScroll = 0;
    var bgSpeed  = 1;
    var bgHeight = 998;

    var heroImgSeq = 0;
    var heroImgMax = 6;
    var heroSpeed  = 6;

    var lbSpeed = 5;
    var lmSpeed = 3;
    var lfSpeed = 1;
    var lbScroll = 0;
    var lmScroll = 0;
    var lfScroll = 0;
    var lbAlpha = 0;
    var lmAlpha = 0;
    var lfAlpha = 0;
    var lHeight = 624;

    var hsAlpha = 0;
    var hsAlpha2 = 0;

    /* プラグインコマンド*/
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        /* あやつる */
        if (command == 'ControlNF') {
            var alreadyExists = false;
            // あやつる判定
            if (args[0] == 'Control') {
                $gameParty._actors.forEach(function( value ) {
                    if(value == this._eventId){
                        alreadyExists = true;
                    }
                }, this);
                if(alreadyExists){
                }else{
                    $gameParty.addActor(this._eventId);
                    $gameActors.actor(this._eventId).recoverAll();
                    //$gameActors._data[this._eventId].restNF = 5;
                    //$gameActors._data[this._eventId].restMaxNF = $gameActors._data[this._eventId].restNF - 1;
                    $gameMessage.newPage();
                    $gameMessage.add($dataActors[this._eventId].name + 'が仲間になった');
                    this.setWaitMode('message');
                    AudioManager.playSe({"name":"あやつる成功","volume":90,"pitch":100,"pan":0})
                }
            }
        }
        /* ターン制マップ行動 */
        if (command == 'AllCharactorMove') {
            $gameMap._events.forEach(function( value ) {
                if(value != null){
                    switch(value._characterName){
                        case '$プロキオン':
                            if(value._moveCount++ !== 0){
                                value._moveAllowed = true;
                                value._moveCount = 0;
                            }
                            break;
                        default:
                            value._moveAllowed = true;
                    }
                }
            });
        }
        /* 罠 */
        if (command == 'Trap' && $gameSwitches.value(16)) {
            $gameMap._events.forEach(function(mapDataEvent) {
                if(mapDataEvent != null){
                    if(!$gameSelfSwitches.value([mapDataEvent._mapId, mapDataEvent._eventId, "A"])){
                        var dataMapEvent = $dataMap.events[mapDataEvent._dataEventId];
                        if(!!dataMapEvent.meta.Trap && this.IsTrapTochPlayer(mapDataEvent)){    
                            switch(dataMapEvent.meta.Trap){
                                case "1":
                                    this.TrapSmallLandMine(mapDataEvent);
                                    break;
                                case "2":
                                    this.TrapBigLandMine(mapDataEvent);
                                    break;
                                case "3":
                                    this.TrapHole(mapDataEvent);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
            }, this);
        }
        /* HP更新 */
        if (command == 'EnemyEventIdUpdate') {
            $gameVariables.setValue(36,this._eventId);
        }
        if (command == 'EnemyHpReflect') {
            //var enemyEventId = $gameVariables.value(36,this._eventId); // ★★
            var enemyEventId = $gameVariables.value(36); // ★★
            if(enemyEventId <= 0){
                return;
            }
            var hpRate = $gameMap._events[enemyEventId]._hpRate;
            var enemy = $gameTroop.members()[0]; // ★EnemyId:0
            var dmg;
            $gameVariables.setValue(37,hpRate); // デバッグ用
            if(hpRate == 1)
            {
                dmg = -1 * (enemy.hp - 1);
            }else{
                dmg = -1 * (enemy.hp * (100 - hpRate) / 100);
            }
            this.changeHp(enemy, dmg, false);
        }
        /* 並び替えリフレッシュ */
        if(command == "ParyLineRefresh"){
            this.ParyLineRefresh();
        }
        /* 暗闇描画 */
        if (command == 'DrawDark') {
            if(waitDark++ > 2){
                waitDark = 0;
                if(plusDark){
                    diffDark += 1;
                    if(diffDark > 1)
                        plusDark = false;
                }else{
                    diffDark -= 1;
                    if(diffDark < -1)
                        plusDark = true;            
                }
            }
            $gameScreen.showPicture(1, "Dark", 1,  $gamePlayer.screenX(),  $gamePlayer.screenY(), 100 + diffDark, 100 + diffDark, 255, 0);
        }
        /* ダンジョン画面 パペット描画 */
        if (command == 'DrawPuppet') {
            var count = 0;
            var fileName = "";
            $gameParty.members().forEach(function(actor) {
                if(actor._actorId != 1){ // 主人公以外
                    switch(actor._actorId){
                        case 10:
                            fileName = "アリオト";
                            break;
                        case 11:
                            fileName = "アダル";
                            break;
                        case 12:
                            fileName = "プロキオン";
                            break;
                        case 13:
                            fileName = "カノープス";
                            break;
                        case 14:
                            fileName = "ハダル";
                            break;
                        case 15:
                            fileName = "カペラ";
                            break;
                        case 16:
                            fileName = "アケルナル";
                            break;
                        case 17:
                            fileName = "ベガ";
                            break;
                    }
                    if(movePapet > 120)
                    {
                        movePapet = 0;
                    }else{
                        movePapet++;
                    }
                    var movePapet1 = 0;
                    var movePapet2 = 0;
                    if(movePapet < 60)
                    {
                        movePapet1 = movePapet;
                    }else{
                        movePapet1 = 120 - movePapet;
                    }
                    if(count < 3){

                        switch(count){
                            case 0:
                                $gameScreen.showPicture(15 + count, fileName, 0, 299 +   0, movePapet1/10 , 100, 100, 255, 0);
                                break;
                            case 1:
                                $gameScreen.showPicture(15 + count, fileName, 0, 299 +  80, 6-movePapet1/10 , 100, 100, 255, 0);
                                break;
                            case 2:
                                $gameScreen.showPicture(15 + count, fileName, 0, 299 + 160, movePapet1/10 , 100, 100, 255, 0);
                                break;
                        }
                        count++;
                    }
                }
            },this);
        }
        /* ゲームオーバー(移動予定) */
        if (command == 'GameOverNF') {
            if(args[0] == 'Init'){
                efCount  = 0;
                bgScroll = 0;
                // 初期表示
                $gameScreen.showPicture(1, "GO_背景", 0, 0, 0        , 100, 100, 255, 0);
                $gameScreen.showPicture(2, "GO_背景", 0, 0, bgHeight, 100, 100, 255, 0);
                $gameScreen.showPicture(3, "GO_キャラ1", 0, 0, 0, 100, 100, 255, 0);

                $gameScreen.showPicture(4, "GO_光奥"  , 0, 0, 0, 100, 100, 255, 0);
                $gameScreen.showPicture(5, "GO_光奥"  , 0, 0, lHeight, 100, 100, 255, 0);
                $gameScreen.showPicture(6, "GO_光中間", 0, 0, 0, 100, 100, 255, 0);
                $gameScreen.showPicture(7, "GO_光中間", 0, 0, lHeight, 100, 100, 255, 0);
                $gameScreen.showPicture(8, "GO_光手前", 0, 0, 0, 100, 100, 255, 0);
                $gameScreen.showPicture(9, "GO_光手前", 0, 0, lHeight, 100, 100, 255, 0);

                $gameScreen.showPicture(10, "GO_想い出①", 1, 408, 306, 100, 100, 255, 0);
                $gameScreen.showPicture(11, "GO_想い出②", 1, 408, 306, 100, 100, 255, 0);
                
                $gameScreen.showPicture(20, "GO_影", 0, 0, 0, 100, 100, 255, 0);
                $gameScreen.showPicture(21, "GO_セリフ枠", 0, 0, 0, 100, 100, 255, 0);

                // プリロード(90~)
                $gameScreen.showPicture(90, "GO_キャラ2", 0, 0, 0, 100, 100, 0, 0);
                $gameScreen.showPicture(91, "GO_キャラ3", 0, 0, 0, 100, 100, 0, 0);
                $gameScreen.showPicture(92, "GO_キャラ4", 0, 0, 0, 100, 100, 0, 0);
                $gameScreen.showPicture(93, "GO_キャラ5", 0, 0, 0, 100, 100, 0, 0);
                $gameScreen.showPicture(94, "GO_キャラ6", 0, 0, 0, 100, 100, 0, 0);
            }
            if(args[0] == 'Draw'){
                efCount++;
                // 背景描画
                if(efCount % bgSpeed == 0){
                    bgScroll++;
                    $gameScreen.movePicture(1,0,0,-1 * bgScroll            ,100,100,255,0,1);
                    $gameScreen.movePicture(2,0,0,-1 * bgScroll + bgHeight,100,100,255,0,1);
                    if(bgScroll == bgHeight){
                        bgScroll = 0;
                    }
                }
                // 光描画
                var efCount1 = efCount;
                var efCount2 = efCount + 100;
                var efCount3 = efCount + 200;
                if(efCount1%300 < 150) lfAlpha = 255 - efCount1%300;
                    else lfAlpha = efCount1%300 - 45;
                if(efCount2%300 < 150) lmAlpha = 255 - efCount2%300;
                    else lmAlpha = efCount2%300 - 45;
                if(efCount3%300 < 150) lbAlpha = 255 - efCount3%300;
                    else lbAlpha = efCount3%300 - 45;

                // 想い出描画(仮)
                var efCount4 = efCount/3;
                if(efCount4%300 < 150)
                    hsAlpha = 100 - (efCount4%300) / 6;
                else
                    hsAlpha = 50 + (efCount4%300) / 6;
                $gameScreen.movePicture(10,1,408,306,hsAlpha,hsAlpha,lbAlpha,0,1);
                // 想い出描画(仮)
                var efCount5 = (efCount + 450)/4;
                if(efCount5%300 < 150)
                    hsAlpha2 = 100 - (efCount5%300) / 6;
                else
                    hsAlpha2 = 50 + (efCount5%300) / 6;
                $gameScreen.movePicture(11,1,408,306,hsAlpha2,hsAlpha2,lfAlpha,0,1);
                // 影描画
                $gameScreen.movePicture(20,0,0,0,100,100,lmAlpha,0,1);

                if(efCount % lbSpeed == 0)
                {
                    lbScroll++;
                    $gameScreen.movePicture(4,0,0,-1 * lbScroll,100,100,lbAlpha,0,1);
                    $gameScreen.movePicture(5,0,0,-1 * lbScroll + lHeight,100,100,lbAlpha,0,1);
                    if(lbScroll == lHeight){
                        lbScroll = 0;
                    }
                }
                if(efCount % lmSpeed == 0)
                {
                    lmScroll++;
                    $gameScreen.movePicture(6,0,0,-1 * lmScroll,100,100,lmAlpha,0,1);
                    $gameScreen.movePicture(7,0,0,-1 * lmScroll + lHeight,100,100,lmAlpha,0,1);
                    if(lmScroll == lHeight){
                        lmScroll = 0;
                    }
                }
                if(efCount % lfSpeed == 0)
                {
                    lfScroll++;
                    $gameScreen.movePicture(8,0,0,-1 * lfScroll,100,100,lfAlpha,0,1);
                    $gameScreen.movePicture(9,0,0,-1 * lfScroll + lHeight,100,100,lfAlpha,0,1);
                    if(lfScroll == lHeight){
                        lfScroll = 0;
                    }
                }
                //主人公描画
                if(efCount % heroSpeed == 0){
                    heroImgSeq++;
                    if(heroImgSeq >= heroImgMax) heroImgSeq = 0;
                    var fileName = "";
                    switch(heroImgSeq){
                        case 0:
                            fileName = "GO_キャラ1";
                            break;
                        case 1:
                            fileName = "GO_キャラ2";
                            break;
                        case 2:
                            fileName = "GO_キャラ3";
                            break;
                        case 3:
                            fileName = "GO_キャラ4";
                            break;
                        case 4:
                            fileName = "GO_キャラ5";
                            break;
                        case 5:
                            fileName = "GO_キャラ6";
                            break;
                    }
                    $gameScreen.showPicture(3, fileName, 0, 0, 0, 100, 100, 255, 0);
                }
            }
        }
        if (command == 'WallSearch') {
            var x = $gameVariables.value(32);
            var y = $gameVariables.value(33);
            if(Input.isPressed('up')){
                y -= 1;
            }else if(Input.isPressed('down')){
                y += 1;
            }else if(Input.isPressed('left')){
                x -= 1;
            }else if(Input.isPressed('right')){
                x += 1;
            }
            $gameVariables.setValue(51, $gameMap.terrainTag(x, y));
        }
    };

    /* あやつる */
    // MP表記をしない
    Window_Base.prototype.drawActorMp = function(actor, x, y, width) {
    };
    // 糸切れ演出
    Game_Interpreter.prototype.ControlNFRelease = function(value)
    {
        $gameParty._actors.forEach(function(member) {
            if(member == value){
                $gameParty.removeActor(value);
                this.ParyLineRefresh();
                AudioManager.playSe({"name":"あやつる解除","volume":120,"pitch":100,"pan":0});
            };
        },this);
    };
    // HP0で糸が切れる処理
    Game_Battler.prototype.refresh = function() {
        Game_BattlerBase.prototype.refresh.call(this);
        if(!this._enemyId && this.hp === 0 && this._actorId != 1 && this._actorId != 10)
        {
            Game_Interpreter.prototype.ControlNFRelease(this._actorId);
        }

        if (this.hp === 0) {
            this.addState(this.deathStateId());
        } else {
            this.removeState(this.deathStateId());
        }
    };
    // PT並び順リフレッシュ(1操作につき、1回実行)
    Game_Interpreter.prototype.ParyLineRefresh = function()
    {
        // 主人公(ID:1)が0,1,2番目に居るかつ、後ろにパペットが要るなら、入れ替えを行う
        for(var lineNo = 2; lineNo >= 0; lineNo--)
        {
            $gameParty._actors.forEach(function(member, index) {
                if(member == 1 && index == lineNo && !!$gameParty._actors[index + 1])
                    $gameParty.swapOrder(index, index + 1);
            },this);
        }
    }

    /* ターン制ダンジョン */
    var _Game_Event_initMembers =  Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function()
    {
        this._moveAllowed = false;
        this._moveCount = 0;
        _Game_Event_initMembers.call(this);
    }
    Game_Event.prototype.updateSelfMovement = function() {
        if (!this._locked && this.isNearTheScreen() && this.checkStop(this.stopCountThreshold()) && $gameSwitches.value(40)) {
        switch (this._moveType) {
            case 1:
                this.moveTypeRandom();
                break;
            case 2:
                this.moveTypeTowardPlayer();
                break;
            case 3:
                this.moveTypeCustom();
                break;
            }
        }
        if(this._moveAllowed && !$gameSwitches.value(40)){
            if(!$gameSelfSwitches.value([this._mapId, this._eventId, "B"])){
                switch (this._moveType) {
                    case 1:
                        this.moveTypeRandom();
                        break;
                    case 2:
                        this.moveTypeTowardPlayer();
                        break;
                    case 3:
                        this.moveTypeCustom();
                      break;
                }
            }else{
                $gameSelfSwitches.setValue([this._mapId, this._eventId, "B"], false);
            }
            this._moveAllowed = false;
        }
    }
    
    /* 罠システム */
    // プレイヤー接触判定
    Game_Interpreter.prototype.IsTrapTochPlayer = function(mapDataEvent)
    {
        // プレイヤー接触判定
        if(mapDataEvent.x == this.character(-1).x && 
           mapDataEvent.y == this.character(-1).y)
            return true;
        else
            return false;
    };
    // 小地雷処理
    Game_Interpreter.prototype.TrapSmallLandMine = function(mapDataEvent)
    {
        this.character(mapDataEvent._eventId).requestAnimation(122);
        $gameSelfSwitches.setValue([mapDataEvent._mapId, mapDataEvent._eventId, "A"], true);
        // プレイヤーへダメージ
        $gameParty.members().forEach(function(actor) {
            this.changeHp(actor, -Math.floor(actor.hp/2), false);
        }.bind(this));

        // エネミーへダメージ
        $gameMap._events.forEach(function(gameDataEventES) {
            if(gameDataEventES != null){
                var dataMapEventES = $dataMap.events[gameDataEventES._dataEventId];
                if(dataMapEventES.name == "Enemy" && $gameSelfSwitches.value([gameDataEventES._mapId, gameDataEventES._eventId, "A"])){
                    var enX = gameDataEventES.x;
                    var enY = gameDataEventES.y;
                    var evX = mapDataEvent.x;
                    var evY = mapDataEvent.y;
                    if(Math.abs(enX - evX) <= 1 && Math.abs(enY - evY))
                    {
                        gameDataEventES._hpRate = gameDataEventES._hpRate / 2;
                        this.character(gameDataEventES._eventId).requestAnimation(66);
                    }
                }
            }
        }, this);
    };

    // 大地雷処理
    Game_Interpreter.prototype.TrapBigLandMine = function(mapDataEvent)
    {
        this.character(mapDataEvent._eventId).requestAnimation(123);
        $gameSelfSwitches.setValue([mapDataEvent._mapId, mapDataEvent._eventId, "A"], true);
        // プレイヤーへダメージ
        $gameParty.members().forEach(function(actor) {
            this.changeHp(actor, -actor.hp, false);
        }.bind(this));

        // エネミーへダメージ
        $gameMap._events.forEach(function(gameDataEventES) {
            if(gameDataEventES != null){
                var dataMapEventES = $dataMap.events[gameDataEventES._dataEventId];
                if(dataMapEventES.name == "Enemy" && $gameSelfSwitches.value([gameDataEventES._mapId, gameDataEventES._eventId, "A"])){
                    var enX = gameDataEventES.x;
                    var enY = gameDataEventES.y;
                    var evX = mapDataEvent.x;
                    var evY = mapDataEvent.y;
                    if(Math.abs(enX - evX) <= 1 && Math.abs(enY - evY))
                    {
                        gameDataEventES._hpRate = 1;
                        this.character(gameDataEventES._eventId).requestAnimation(67);
                    }
                }
            }
        }, this);
    };

    // 落とし穴処理
    Game_Interpreter.prototype.TrapHole = function(mapDataEvent)
    {
        if($gameVariables.value(22) != 5){//★要書き換え★
            $gameSelfSwitches.setValue([mapDataEvent._mapId, mapDataEvent._eventId, "A"], true);
            this.setupChild($dataCommonEvents[21].list, this._eventId);
        }
    }

    // イベントにHP率の概念を付与
    var _Game_Event_prototype_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_prototype_initialize.call(this, mapId, eventId);
        this._hpRate = 100; // HPの割合 百分率
    };

    /* 戦闘開始演出 */
    // 既存演出の解除
    BattleManager.displayStartMessages = function()
    {
    };
    // 既存演出の解除
    Scene_Map.prototype.startEncounterEffect = function() {
        this._spriteset.hideCharacters();
    };
    // 戦闘開始演出の追加
    var _Scene_Battle_Create_Spriteset = Scene_Battle.prototype.createSpriteset;
    Scene_Battle.prototype.createSpriteset = function() {
        _Scene_Battle_Create_Spriteset.call(this);

        this._Splash = [];
        this._SplashCount = 0;
        this._SplashCount2 = 0;
        this._Splash.push(new Sprite(ImageManager.loadPicture('1')));
        this._Splash.push(new Sprite(ImageManager.loadPicture('2')));
        this._Splash.push(new Sprite(ImageManager.loadPicture('3')));
        this.addChild(this._Splash[0]);
        this.addChild(this._Splash[1]);
        this.addChild(this._Splash[2]);
        this._Splash[0].alpha = 255;
        this._Splash[1].alpha = 0;
        this._Splash[2].alpha = 0;

    };
    var _Scene_Battle_Update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        // 幕開け
        var firstWait = 37;
        var animationWait = 10;
        var endWait = firstWait + (animationWait * 2) + 20;
        if(this._SplashCount == firstWait){
            this._Splash[0].alpha = 0;
            this._Splash[1].alpha = 255;
        }else if(this._SplashCount == firstWait + animationWait){
            this._Splash[1].alpha = 0;
            this._Splash[2].alpha = 255;
        }else if(this._SplashCount == firstWait + (animationWait * 2)){
            this._Splash[2].alpha = 0;
        }
        if (this._SplashCount <= endWait){
            this._SplashCount++;
        }
        // 幕閉じ
        if($gameSwitches.value(29)){
            if(this._SplashCount2 == firstWait){
                this._Splash[2].alpha = 255;
            }else if(this._SplashCount2 == firstWait + animationWait){
                this._Splash[1].alpha = 255;
                this._Splash[2].alpha = 0;
            }else if(this._SplashCount2 == firstWait + (animationWait * 2)){
                this._Splash[0].alpha = 255;
                this._Splash[1].alpha = 0;
            }
            if (this._SplashCount2 <= endWait){
                this._SplashCount2++;
            }else{
                $gameSwitches.setValue(29,false);
            }
        }
        var active = this.isActive();
        $gameTimer.update(active);
        $gameScreen.update();
        if (this._SplashCount > endWait){
            this.updateStatusWindow();
            this.updateWindowPositions();
            if (active && !this.isBusy()) {
                this.updateBattleProcess();
            }
        }
        Scene_Base.prototype.update.call(this);
    };
    
    /* 戦闘メニュー改造 */
    Window_Base.prototype.drawActorName = function(actor, x, y, width) {
        width = width || 168;

        if(actor._actorId == 1)
            this.changeTextColor(this.textColor(17));
        else
            this.changeTextColor(this.hpColor(actor));
        
        this.drawText(actor.name(), x, y, width);
    };

    Window_ActorCommand.prototype.makeCommandList = function() {
    if (this._actor) {
            if(this._actor._actorId == 1)
                this.addItemCommand();   
            else
                this.addSkillCommands();
        }
    };

    // 主人公の並び替え禁止
    var _Scene_Menu_prototype_onFormationOk = Scene_Menu.prototype.onFormationOk;
    Scene_Menu.prototype.onFormationOk = function() {
        var index = this._statusWindow.index();
        var actor = $gameParty.members()[index];
        if(actor._actorId == 1)
        {
            this._statusWindow.activate();
            AudioManager.playSe({"name":"Buzzer1","volume":90,"pitch":100,"pan":0})
        }else{
            _Scene_Menu_prototype_onFormationOk.call(this);
        }
    };

    /* 主人公に攻撃を当てない */
    Game_Unit.prototype.aliveMembers = function() {
        return this.members().filter(function(member) {
            return member.isAlive();
        });
    };
    Game_Unit.prototype.tgrSum = function() {
        return this.aliveMembers().reduce(function(r, member) {
            return r + member.tgr;
        }, 0);
    };
    Game_Unit.prototype.randomTarget = function() {
        var tgrRand = Math.random() * this.tgrSum();
        var target = null;
        this.aliveMembers().forEach(function(member) {
            tgrRand -= member.tgr;
            if (tgrRand <= 0 && !target) {
                target = member;
            }
        });
        // Add
        if(target._actorId == 1 && Math.random() > 0.2)
        {
            if(this.tgrSum() > 1)
            {
                var reTgrRand = Math.random() * (this.tgrSum() - 1);
                var reTarget = null;
                this.aliveMembers().forEach(function(member) {
                    if(member._actorId != 1){
                        reTgrRand -= member.tgr;
                        if (reTgrRand <= 0 && !reTarget) {
                            reTarget = member;
                        }
                    }
                });
                return reTarget;
            }else{
                return target;
            }
        }
        // Add
        return target;
    };
    /* アリオトに不死属性付与 */
    //var _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    //Game_Action.prototype.executeHpDamage = function(target, value) {
    //    if (target._hp > 0 && value >= target._hp && (target._actorId == 2 || target._actorId == 10))
    //        value = target._hp - 1;
    //    _Game_Action_executeHpDamage.call(this, target, value);
    //};
    /* パッシブスキル関係 */
    /* アイコン表示数を固定値に変更 */
    Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
        width = width || 144;
        var icons = actor.allIcons().slice(0, Math.floor(6)); // Mod
        for (var i = 0; i < icons.length; i++) {
            this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
        }
    };
    /* 戦闘画面のHPゲージを短く */
    Window_BattleStatus.prototype.gaugeAreaWidth = function() {
        return 205;
    };
    
    /* メニュー位置調整 */
    SceneManager.snapForBackground = function() {
        this._backgroundBitmap = this.snap();
        //this._backgroundBitmap.blur();
    };
    Window_MenuCommand.prototype.makeCommandList = function() {
        this.addMainCommands();
        this.addFormationCommand();
        this.addOriginalCommands();
        this.addOptionsCommand();
        this.addSaveCommand();
        this.addGameEndCommand();
    };
    // レベル非表示
    Window_Base.prototype.drawActorLevel = function(actor, x, y) {
        //this.changeTextColor(this.systemColor());
        //this.drawText(TextManager.levelA, x, y, 48);
        //this.resetTextColor();
        //this.drawText(actor.level, x + 84, y, 36, 'right');
    };
    // 職業非表示
    Window_Base.prototype.drawActorClass = function(actor, x, y, width) {
    };
    Window_MenuStatus.prototype.drawItemStatus = function(index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRect(index);
        var x = rect.x + 162;
        var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
        var width = rect.width - x - this.textPadding();
        this.drawActorSimpleStatus(actor, x, y, width);
    };
    Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        var lineHeight = this.lineHeight();
        var x2 = x + 180;
        var width2 = Math.min(200, width - 180 - this.textPadding());
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.drawActorHp(actor, x, y + lineHeight * 1, width2 + 100);
        //this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
    };
    Window_MenuStatus.prototype.drawItemImage = function(index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRect(index);
        this.changePaintOpacity(actor.isBattleMember());
        this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth * 0.75, Window_Base._faceHeight * 0.75);
        this.changePaintOpacity(true);
    };
    // オートダッシュ無効
    Window_Options.prototype.addGeneralOptions = function() {
        //this.addCommand(TextManager.alwaysDash, 'alwaysDash');
        this.addCommand(TextManager.commandRemember, 'commandRemember');
    };

    var heroAlive = false;
    // ゲームオーバー
    BattleManager.updateBattleEnd = function() {
        if (this.isBattleTest()) {
            AudioManager.stopBgm();
            SceneManager.exit();
        } else if (!this._escaped && ($gameParty.isAllDead() || !heroAlive)) {
            if (this._canLose) {
                $gameParty.reviveBattleMembers();
                SceneManager.pop();
            } else {
                SceneManager.goto(Scene_Map);
                $gamePlayer.reserveTransfer(20, 0, 0, 0, 0);
            }
        } else {
            SceneManager.pop();
        }
        this._phase = null;
    };
    BattleManager.checkBattleEnd = function() {
        if (this._phase) {
            //主人公　生死チェック
            heroAlive = true;
            $gameParty.members().forEach(function( value ) {
                if(value._actorId == 1 && value.hp == 0){
                    heroAlive = false;
                }
            }, this);
            //
            if (this.checkAbort()) {
                return true;
            } else if ($gameParty.isAllDead() || !heroAlive) {
                this.processDefeat();
                return true;
            } else if ($gameTroop.isAllDead()) {
                this.processVictory();
                return true;
            }
        }
        return false;
    };
    
    // ゲームオーバー判定を無効に
    Scene_Base.prototype.checkGameover = function() {
        //if ($gameParty.isAllDead()) {
        //    SceneManager.goto(Scene_Map);
        //    $gamePlayer.reserveTransfer(20, 0, 0, 0, 0);
        //}
    };

    // セーブ＆ロード画面で1キャラ目しか表示しない
    Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
        if (info.characters) {
            //for (var i = 0; i < info.characters.length; i++) {
            for (var i = 0; i < 1; i++) {
                var data = info.characters[i];
                this.drawCharacter(data[0], data[1], x + i * 48, y);
            }
        }
    };

})();