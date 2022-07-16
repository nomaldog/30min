/*:
 * @plugindesc Skip the title scene for testing purpose.
 * @version 1.0
 */
 
(function() {
 
    Scene_Boot.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        SoundManager.preloadImportantSounds();
        if (DataManager.isBattleTest()) {
            DataManager.setupBattleTest();
            SceneManager.goto(Scene_Battle);
        } else {
            this.checkPlayerLocation();
            DataManager.setupNewGame();
            SceneManager.goto(Scene_Map);
        }
        this.updateDocumentTitle();
    };

    Scene_GameEnd.prototype.commandToTitle = function() {
        this.fadeOutAll();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    };

    // Return to Title Screen
    Game_Interpreter.prototype.command354 = function() {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
        return true;
    };

})();