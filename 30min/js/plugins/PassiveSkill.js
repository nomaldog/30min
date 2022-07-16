//=============================================================================
// PassiveSkill.js
// ----------------------------------------------------------------------------
// Copyright (c) 2019 nomaldog
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2019/03/03 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/nomaldog/
//=============================================================================

/*:ja
 * @plugindesc パッシブスキルプラグイン(現状ではNF専用)
 * @author nomaldog
 *
 * @help
 * 
 * 戦闘時、個人に対してステート付与する場合
 * スキルのメモ欄に以下の記載をする(N1,N2はステートのID)
 * <PersonalState:[N1,N2...]>
 * 
 * 戦闘時、パーティ全体にステート付与する場合
 * スキルのメモ欄に以下の記載をする(N1,N2はステートのID)
 * <PartyState:[N1,N2...]>
 * 
 * 注意点：このプラグインで付与するステートは戦闘終了自動解除にしておくこと。
 * 
 * プラグインコマンド
 * "PassiveSkillReflect"：パッシブスキルによるステート付与
 * 
 */
(function() {
    
    /* プラグインコマンド*/
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        /* パッシブスキル */
        if (command == 'PassiveSkillReflect') {
            $gameParty.members().forEach(function(actor) {
                $gameActors._data[actor._actorId]._skills.forEach(function(skillId) {
                    var personalStateId;
                    // 個人ステート付与
                    if(!!$dataSkills[skillId].meta.PersonalState){
                        personalStateId = JSON.parse($dataSkills[skillId].meta.PersonalState);
                        personalStateId.forEach(function(stateId) {
                            actor.addState(stateId);
                        }, this);
                    }
                    // パーティステート付与
                    if(!!$dataSkills[skillId].meta.PartyState){
                        partyStateId = JSON.parse($dataSkills[skillId].meta.PartyState);
                        partyStateId.forEach(function(stateId) {
                            $gameParty.members().forEach(function(actorPartyMember) {
                                actorPartyMember.addState(stateId);
                            }, this);
                        }, this);
                    }

                }, this);
            });
        }
    };

    /* 戦闘メニュー描画 */
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
})();