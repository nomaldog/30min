//=============================================================================
// DynamicItemManager.js
// ----------------------------------------------------------------------------
// Copyright (c) 2018 nomaldog
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/10/23 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/nomaldog/
//=============================================================================

/*:ja
 * @plugindesc ポケット的アイテム管理用プラグイン
 * @author nomaldog
 *
 * @help  作成中
 * 
 * @param Max Possession
 * @desc 限界所持数
 * @default 10
 */

var DIM = DIM || {};
DIM.Param = DIM.Param || {};
DIM.Parameters = PluginManager.parameters('DynamicItemManager');
DIM.Param.MaxPossession = Number(DIM.Parameters["Max Possession"]);

(function() {


    function CopyItem(fromItemId, toItemId){
        // アイテムDBのコピーを行います(不完全コピー)
        $dataItems[toItemId].animationId      = $dataItems[fromItemId].animationId;
        $dataItems[toItemId].consumable       = $dataItems[fromItemId].consumable;
        $dataItems[toItemId].damage.critical  = $dataItems[fromItemId].damage.critical;
        $dataItems[toItemId].damage.alementId = $dataItems[fromItemId].damage.alementId;
        $dataItems[toItemId].damage.formula   = $dataItems[fromItemId].damage.formula;
        $dataItems[toItemId].damage.type      = $dataItems[fromItemId].damage.type;
        $dataItems[toItemId].damage.variance  = $dataItems[fromItemId].damage.variance;
        $dataItems[toItemId].description      = $dataItems[fromItemId].description;
        $dataItems[toItemId].hiType           = $dataItems[fromItemId].hiType;
        $dataItems[toItemId].iconIndex        = $dataItems[fromItemId].iconIndex;
        $dataItems[toItemId].itypeId          = $dataItems[fromItemId].itypeId;
        $dataItems[toItemId].name             = $dataItems[fromItemId].name;
        $dataItems[toItemId].note             = $dataItems[fromItemId].note;
        $dataItems[toItemId].occasion         = $dataItems[fromItemId].occasion;
        $dataItems[toItemId].price            = $dataItems[fromItemId].price;
        $dataItems[toItemId].repeats          = $dataItems[fromItemId].repeats;
        $dataItems[toItemId].scope            = $dataItems[fromItemId].scope;
        $dataItems[toItemId].speed            = $dataItems[fromItemId].speed;
        $dataItems[toItemId].successRate      = $dataItems[fromItemId].successRate;
        $dataItems[toItemId].tpGain           = $dataItems[fromItemId].tpGain;
        $dataItems[toItemId].effects          = $dataItems[fromItemId].effects;
    }
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command == 'DIM') {
            if (args[0] == 'AddItem') {
                // アイテムの追加を行います
                // args[0]:コマンド名
                // args[1]:アイテムID
                var findFree = -1;
                for (var i = 1; i <= DIM.Param.MaxPossession; i++) {
                    if(typeof $gameParty._items[i] === "undefined")
                    {
                        findFree = i;
                        break;
                    }
                }
                if(findFree < 0){
                    $gameMessage.newPage();
                    $gameMessage.add('これ以上持てません');
                    this.setWaitMode('message');
                    $gameVariables.setValue(9,-1); // アイテム取得失敗
                }else{
                    CopyItem(args[1], findFree);
                    $gameParty.gainItem($dataItems[findFree], 1);
                    $gameVariables.setValue(9,0); // アイテム取得成功
                }
            }
        }
    }
})();