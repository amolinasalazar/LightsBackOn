var t2p      = function(t)     { return t*TILE;                  },
	p2t      = function(p)     { return Math.floor(p/TILE);      },
	cell     = function(x,y)   { return tcell(p2t(x),p2t(y));    },
	tcell    = function(tx,ty) { return Cells[tx + (ty*MAP.tw)]; };