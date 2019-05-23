import { IDictionary } from "./chessHelpers";

export interface IChallenge {
	id: string;
	socketId: string; // challenger socket id
	sub: string; // challenger sub claim
	pieces: string; // selected pieces
	time?: number; // selected time
}

export const challengeService = {
	challenges: [] as IChallenge[],
	getBySocketId: function(socketId: string) {
		return this.challenges.find(ch => ch.socketId === socketId);
	},
	getBySub: function(sub: string) {
		return this.challenges.find(ch => ch.sub === sub);
	},
	getById: function(id: string) {
		return this.challenges.find(ch => ch.id === id);
	},
	removeBySocketId: function(socketId: string) {
		var ind = this.challenges.findIndex(ch => ch.socketId === socketId);
		if (ind !== -1) {
			this.challenges.splice(ind, 1);
		}

		return ind !== -1;
	},
	removeById: function(id: string) {
		var ind = this.challenges.findIndex(ch => ch.id === id);
		if (ind !== -1) {
			this.challenges.splice(ind, 1);
		}

		return ind !== -1;
	},
	removeBySub: function(sub: string) {
		var ind = this.challenges.findIndex(ch => ch.sub === sub);
		if (ind !== -1) {
			this.challenges.splice(ind, 1);
		}

		return ind !== -1;
	},
	removeAllById: function(id: string) {
		var ids = this.challenges.filter(v => v.id === id).map(v => v.id);		
		arrayRemoveWhile(this.challenges, (v, ind) => v.id === id);
		return ids;
	},
	removeAllBySub: function(sub: string) {
		var ids = this.challenges.filter(v => v.sub === sub).map(v => v.id);
		arrayRemoveWhile(this.challenges, (v, ind) => v.sub === sub);
		return ids;
	},
	removeAllBySocketId: function(socketId: string) {	
		var ids = this.challenges.filter(v => v.socketId === socketId).map(v => v.id);
		arrayRemoveWhile(this.challenges, (v, ind) => v.socketId === socketId);
		return ids;
	},
	addChallenge: function(challenge: IChallenge) {
		this.challenges.push(challenge);
	}
}

export const arrayRemoveWhile = <T>(arr: T[], callback: (v: T, ind: number) => boolean) => {
    var i = arr.length;
    while (i--) {
        if (callback(arr[i], i)) {
            arr.splice(i, 1);
        }
    }
};