var t2p      = function(t)     { return t*TILE;                  }, // tile to palette transformation
	p2t      = function(p)     { return Math.floor(p/TILE);      }, // palette to tile transformation
	cell     = function(x,y)   { return tcell(p2t(x),p2t(y));    }, // canvas cell
	tcell    = function(tx,ty) { return Cells[tx + (ty*MAP.tw)]; }; // tile cell