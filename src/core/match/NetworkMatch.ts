import type Game from "$core/game/Game";

import { get } from "svelte/store";
import { Mixin } from 'ts-mixer';

import GameModeEnum from "$lib/enums/GameModeEnum";
import PlayerEnum from "$lib/enums/PlayerEnum";
import Networking from "$core/mixins/Networking";
import Match from "$core/match/Match";


class NetworkMatch extends Mixin(Networking, Match) {

  constructor(game: Game) {
    super(game, GameModeEnum.NETWORK);

    const player = get(this.game.player);
    if (player === PlayerEnum.ONE) this.createOffer();
    else if (player === PlayerEnum.TWO) this.createAnswer();
  }
  changeTurn(): void {
    super.changeTurn();
    // TODO: Send event throught WebRTC datachannel
  }
}

export default NetworkMatch;