//=============================================================================
// NMG_FrontEnemyMotion.js
// ----------------------------------------------------------------------------
// Copyright (c) 2019 nomaldog
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 YYYY/MM/DD 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/nomaldog/
//=============================================================================

/*:ja
 * @plugindesc フロントビュー戦闘用の敵エネミーモーションプラグイン
 * @author nomaldog
 * @help
 * 
 * @param 拡大縮小：スイッチ
 * @desc 拡大縮小ON/OFF true / false
 * @default true
 * 
 * @param 拡大縮小：最大値
 * @desc 拡大縮小の最大値(%)
 * @default 2.5
 * 
 * @param 拡大縮小：最小値
 * @desc 拡大縮小の最小値(%)
 * @default 2.5
 * 
 * @param 拡大縮小：速度
 * @desc 拡大縮小の更新速度(%)
 * @default 0.125
 * 
 * @param 反復上下：スイッチ
 * @desc 反復上下ON/OFF true / false
 * @default true
 * 
 * @param 反復上下：最大値
 * @desc 反復上下の最大値(px)
 * @default 10
 * 
 * @param 反復上下：最小値
 * @desc 反復上下の最小値px)
 * @default 10
 * 
 * @param 反復上下：速度
 * @desc 反復上下の更新速度(px)
 * @default 1
 * 
 */
(function() {
    var default_ScaleAnOn    = Boolean(PluginManager.parameters('NMG_FrontEnemyMotion')['拡大縮小：スイッチ']);
    var default_ScaleAnMax   = Number (PluginManager.parameters('NMG_FrontEnemyMotion')['拡大縮小：最大値']);
    var default_ScaleAnMin   = Number (PluginManager.parameters('NMG_FrontEnemyMotion')['拡大縮小：最小値']);
    var default_ScaleAnSpeed = Number (PluginManager.parameters('NMG_FrontEnemyMotion')['拡大縮小：速度']);

    var default_UpDownAnOn    = Boolean(PluginManager.parameters('NMG_FrontEnemyMotion')['反復上下：スイッチ']);
    var default_UpDownAnMax   = Number (PluginManager.parameters('NMG_FrontEnemyMotion')['反復上下：最大値']);
    var default_UpDownAnMin   = Number (PluginManager.parameters('NMG_FrontEnemyMotion')['反復上下：最小値']);
    var default_UpDownAnSpeed = Number (PluginManager.parameters('NMG_FrontEnemyMotion')['反復上下：速度']);

    var _Sprite_Enemy_prototype_initMembers = Sprite_Enemy.prototype.initMembers;
    Sprite_Enemy.prototype.initMembers = function() {
        _Sprite_Enemy_prototype_initMembers.call(this);
        // 拡大縮小：変数
        this._anScaleDiff  = 0;
        this._anScalePlus  = true;
        this._anScaleOn    = default_ScaleAnOn;
        this._anScaleSpeed = default_ScaleAnSpeed;
        this._anScaleMax   = default_ScaleAnMax;
        this._anScaleMin   = -1 * default_ScaleAnMin;
        // 反復上下：変数
        this._anUpDownDiff  = 0;
        this._anUpDownPlus  = true;
        this._anUpDownOn    = default_UpDownAnOn;
        this._anUpDownSpeed = default_UpDownAnSpeed;
        this._anUpDownMax   = default_UpDownAnMax;
        this._anUpDownMin   = -1 * default_UpDownAnMin;
        // 基軸座標取得
        this._beforeSetStdXY = true;
        this._anStdX = 0;
        this._anStdY = 0;
    };

    var _Sprite_Enemy_prototype_update = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function() {
        _Sprite_Enemy_prototype_update.call(this);
        if (this._enemy) {
            // 基軸座標設定
            if(this._beforeSetStdXY)
            {
                this._beforeSetStdXY = false;
                this._anStdX = this.x;
                this._anStdY = this.y;
            }
            // 拡大縮小モーション
            if(this._anScaleOn){
                if(this._anScalePlus){
                    this._anScaleDiff += this._anScaleSpeed;
                    if(this._anScaleDiff >= this._anScaleMax)
                    {
                        this._anScaleDiff = this._anScaleMax;
                        this._anScalePlus = false;
                    }
                }else{
                    this._anScaleDiff -= this._anScaleSpeed;
                    if(this._anScaleDiff <= this._anScaleMin)
                    {
                        this._anScaleDiff = this._anScaleMin;
                        this._anScalePlus = true;
                    }
                }
                this.scale.x = 1 + (this._anScaleDiff / 100);
                this.scale.y = 1 + (this._anScaleDiff / 100);
            }
            // 反復上下モーション
            if(this._anUpDownOn){
                if(this._anUpDownPlus){
                    this._anUpDownDiff += this._anUpDownSpeed;
                    if(this._anUpDownDiff >= this._anUpDownMax)
                    {
                        this._anUpDownDiff = this._anUpDownMax;
                        this._anUpDownPlus = false;
                    }
                }else{
                    this._anUpDownDiff -= this._anUpDownSpeed;
                    if(this._anUpDownDiff <= this._anUpDownMin)
                    {
                        this._anUpDownDiff = this._anUpDownMin;
                        this._anUpDownPlus = true;
                    }
                }
                this.y = this._anStdY + this._anUpDownDiff;
            }
        }
    };
})();