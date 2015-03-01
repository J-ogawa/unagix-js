(function() {
  var viewSide = 'black';
  var role = 'black';
  var turn = 'black';
  var roles = ['black', 'white'];
  var komaTypes = ['Hu', 'Ky', 'Ke', 'Gi', 'Ki', 'Ka', 'Hi', 'Gy', 'NHu', 'NKy', 'NKe', 'NGi', 'NKa', 'NHi'];
  var size = { x: 9, y: 9 };

  var kifu = [];

  var kifuCoodinate = [
    { x: '１', y: '一'},
    { x: '２', y: '二'},
    { x: '３', y: '三'},
    { x: '４', y: '四'},
    { x: '５', y: '五'},
    { x: '６', y: '六'},
    { x: '７', y: '七'},
    { x: '８', y: '八'},
    { x: '９', y: '九'}
  ];

  var kifuTypeMaster = {
    Hu:   '歩',
    Ky:   '香',
    Ke:   '桂',
    Gi:   '銀',
    Ki:   '金',
    Ka:   '角',
    Hi:   '飛',
    Gy:   '玉',
    NHu:  'と',
    NKy:  '成香',
    NKe:  '成桂',
    NGi:  '成銀',
    NKa:  '馬',
    NHi:  '龍'
  };

  // ------ kifu data ------

  function convertUrlStrToNum(str) {
    var ascii = str.charCodeAt(0);
    if (39 <= ascii && ascii <= 42) return ascii - 39;
    else if (45 <= ascii && ascii <= 46) return ascii - 41;
    else if (48 <= ascii && ascii <= 57) return ascii - 42;
    else if (64 <= ascii && ascii <= 90) return ascii - 48;
    else if (95 == ascii) return ascii - 52;
    else if (97 <= ascii && ascii <= 122) return ascii - 53;
    else return null;
  }

  function convertIntToUrlStr(int) {
    var ascii = null;
    if (0 <= int && int <= 3) ascii = int + 39;
    else if (4 <= int && int <= 5) ascii = int + 41;
    else if (6 <= int && int <= 15) ascii = int + 42;
    else if (16 <= int && int <= 42) ascii = int + 48;
    else if (43 == int) ascii = int + 52;
    else if (44 <= int && int <= 69) ascii = int + 53;

    return !!ascii ? String.fromCharCode(ascii) : null;
  }

  function convertKifuToInfo(str) {
    var role = convertToRole(str.slice(0, 1));
    var x = convertToX(str.slice(1, 2));
    var y = convertToY(str.slice(2, 3));
    var type = convertToType(str.slice(3, 4));
    //TODO promote
    return { role: role, coodinate: { x: x, y: y }, type: type }
  }

  function convertToRole(str) {
    return str == '▲' ? 'black' : 'white';
  }

  function convertXToKifuStr(x) {
    return kifuCoodinate[x].x;
  }

  function convertYToKifuStr(y) {
    return kifuCoodinate[y].y;
  }

  function convertTypeToKifuStr(type) {
    return kifuTypeMaster[type];
  }

  function convertToX(str) {
    var x = null;
    kifuCoodinate.forEach(function(coodiElem, idx) {
      if (coodiElem.x == str) x = idx;
    });
    return x;
  }

  function convertToY(str) {
    var y = null;
    kifuCoodinate.forEach(function(coodiElem, idx) {
      if (coodiElem.y == str) y = idx;
    });
    return y;
  }

  function convertToType(kifuType) {
    for (key in kifuTypeMaster) {
      if (kifuTypeMaster[key] == kifuType) return key;
    }
  }

  function convertTypeToInt(type) {
    var int = null;
    komaTypes.forEach(function(typeElem, idx) {
      if (typeElem == type) int = idx;
    });
    return int;
  }

  function convertIntAndOwnerToMoveStr(int, owner) {
    var type = komaTypes[parseInt(int / 81)];
    var y = parseInt((int % 81) / 9);
    var x = int % 81 % 9;

    var masu = new Masu({x: x, y: y});
    var koma = new Koma({owner: owner, type: type});
    koma.masu = masu;
    return createKifuMove(koma, 'none'); //TODO
  }

  function createKifuMove(koma, promote) {
    var roleStr = koma.owner == 'black' ? '▲': '△';
    var xStr = convertXToKifuStr(koma.masu.coodinate.x);
    var yStr = convertYToKifuStr(koma.masu.coodinate.y);
    var typeStr = convertTypeToKifuStr(koma.type);
    var promoteStr = '';
    if (promote == 'accept') {
      typeStr = convertTypeToKifuStr(koma.type.slice(1));
      promoteStr = '成';
    } else if (promote == 'deny') {
      promoteStr = '不成';
    }
    return roleStr + xStr + yStr + typeStr + promoteStr;
  }

  function saveToKifu(move) {
    kifu.push(move);
    console.log(convertKifuToUrlStr());
  }

  function convertInfoToInt(info) {
    var x =      info.coodinate.x;
    var y =  9 * info.coodinate.y;
    var type = 81 * convertTypeToInt(info.type);
    return x + y + type;
  }

  function convertKifuToUrlStr() {
    urlStr = '';
    kifu.forEach(function(move) {
      var int = convertInfoToInt(convertKifuToInfo(move));
      console.log(move + ': ' + int);
      var firstStr = convertIntToUrlStr(int / 69);
      var secontStr = convertIntToUrlStr(int % 69);
      urlStr = urlStr + firstStr + secontStr;
    });
    return urlStr;
  }

  function moveWithKifu(str) {
  }

  // ------ shogi logic ------

  function reachVector(type) {
    var basic = {
      Hu: [{x: 0, y: -1}],
      Ky: [{x: 0, y: -1}],
      Ke: [{x: -1, y: -2}, {x: 1, y: -2}],
      Gi: [{x: -1, y: -1}, {x: -1, y: 1}, {x: 0, y: -1}, {x: 1, y: -1}, {x: 1, y: 1}],
      Ki: [{x: -1, y: -1}, {x: -1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}, {x: 1, y: -1}, {x: 1, y: 0}],
      Ka: [{x: -1, y: -1}, {x: -1, y: 1}, {x: 1, y: -1}, {x: 1, y: 1}],
      Hi: [{x: -1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}, {x: 1, y: 0}],
      Gy: [{x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -1}, {x: 0, y: 1}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 1, y: 1}]
    };
    switch(type) {
      case 'NKa':
      case 'NHi':
        return basic[type.slice(1)].concat(basic['Gy']).filter(function (x, i, self) {
          return self.indexOf(x) === i;
        });
      case 'NHu':
      case 'NKy':
      case 'NKe':
      case 'NGi':
        return basic['Ki'];
      default:
        return basic[type];
    }
  }

  var masus = [];
  var selectedKoma;
  var reachingMasuCoodinates = [];
  var blackKomadai;
  var whiteKomadai;

  function isMyTurn() {
    return role == turn ? true : false;
  }

  function isMine(element) {
    return role == element.owner ? true : false;
  }

  function isOpponentArea(coodinate) {
    return (role == 'black' && coodinate.y < 3) || (role == 'white' && coodinate.y > 5);
  }

  function myKomadai() {
    return role == 'black' ? blackKomadai : whiteKomadai;
  }

  function isCheckmate(role) {
      for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 9; y++) {
          var koma = masus[x][y];
          if (!!koma && koma.owner == role && koma.type == 'Gy') {
            return koma.isAvoidableTaken();
          }
        }
      }

  }

  function switchPhase() {
    roles.some(function(mRole, idx) {
      if (mRole == role) {
        next = roles[(idx + 1) % roles.length];
        return true;
      }
    });
    if (isCheckmate(next)) {

    } else {
      role = next;
    }
  }

  function mergedCoodinate(coo1, coo2) {
    return {x: coo1.x + coo2.x, y: coo1.y + coo2.y};
  }

  function dereachAllMasus() {
    reachingMasuCoodinates.forEach(function(coodinate) {
      masus[coodinate.x][coodinate.y].beDereached();
    });
    reachingMasuCoodinates = [];
  }

  // ------ constructor ------

  function Ban() {
    var dom = document.createElement('div');
    dom.className = 'ban';
    this.dom = dom;
  }

  function Koma(params) {
    this.type = params.type;
    this.owner = params.owner;
    this.promoted = function() {
      return this.type.length === 3 && this.type.slice(0, 1) === 'N';
    };
    var dom = document.createElement('img');
    dom.className = 'koma';
    dom.onclick = function() {
      this.komasReachingMe();
      var bool = this.isAvoidableReaching();
      console.log(bool)
      if (!isMyTurn) return;
      if (isMine(this)) {
        selectedKoma = this;
        this.updateReachingMasuCoodinates();
      } else {
        if (!!selectedKoma && !!this.masu && this.masu.isReached) {
          var move = selectedKoma.take(this);
          saveToKifu(move);
          switchPhase();
        } else {
          dereachAllMasus();
        }
      }
    }.bind(this);
    this.dom = dom;

    this.updateStyle = function() {
      this.dom.src = 'img/' + this.type + '.png';
      this.dom.style.webkitTransform = this.owner == 'black' ? 'rotate(0deg)' : 'rotate(180deg)';
    };
    this.updateStyle();

    this.move = function(destination) {
      var promote = 'none';
      if (destination.constructor === Masu) {
        var masu = destination;
        masu.koma = this;
        masu.dom.appendChild(this.dom);
        if (!!this.masu) {
          promote = this.promote(destination);
          this.masu.koma = null;
        }
        this.masu = masu;
      } else if (destination.constructor === Komadai) {
        var komadai = destination;
        komadai.dom.appendChild(this.dom);
        this.owner = komadai.owner;
        this.updateStyle();
        this.unpromote();
        if (!!this.masu) {
          this.masu.koma = null;
        }
      }
      return createKifuMove(this, promote);
    };

    this.promote = function(destination) {
      if (!this.promoted() && (isOpponentArea(this.masu.coodinate) || isOpponentArea(destination.coodinate))) {
        if (confirm('成りますか？')) {
          this.type = 'N' + this.type;
          this.updateStyle();
          return 'accept';
        } else {
          return 'deny';
        }
      } else {
        return 'none';
      }
    }

    this.unpromote = function(destination) {
      if (this.promoted()) {
        this.type = this.type.slice(1);
        this.updateStyle();
      }
    }

    this.take = function(koma) {
      masu = koma.masu;
      koma.move(myKomadai());
      dereachAllMasus();
      var move = this.move(koma.masu);
      koma.masu = null;
      return move;
    };

    this.updateReachingMasuCoodinates = function() {
      dereachAllMasus();
      if (!!this.masu) this.reachFromMasu();
      else this.reachFromKomadai();
    };

    this.reachFromKomadai = function() {
      for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 9; y++) {
          if (!masus[x][y].koma) {
            switch(this.type) {
              case 'Hu':
                if (yLineOfExistMyHu().indexOf(x) >= 0) {
                  break;
                } else if(!isDeepestOpponentLine(y)) {
                  masus[x][y].beReached();
                }
                break;
              case 'Ky':
                if(!isDeepestOpponentLine(y)) {
                  masus[x][y].beReached();
                }
                break;
              case 'Hu':
                if((role == 'black' && y > 1) || role == 'white' && y < 7) {
                  masus[x][y].beReached();
                }
                break;
              default:
                masus[x][y].beReached();
                break;
            }
          }
        }
      }

      function isDeepestOpponentLine(y) {
        return (role == 'black' && y == 0) || (role == 'white' && y == 8);
      }

      function yLineOfExistMyHu() {
        var lines = [];
        for (var x = 0; x < 9; x++) {
          for (var y = 0; y < 9; y++) {
            var koma = masus[x][y].koma;
            if (!!koma
                && koma.owner == role
                && koma.type == 'Hu') {
                  lines.push(x);
                  break;
                }
          }
        }
        return lines;
      }
    };

    this.reachFromMasu = function() {
      var reachingMasus = this.reachingMasus();
      reachingMasus.forEach(function(masu) {
        masu.beReached();
      });
    };

    this.komasReachingMe = function() {
      var komas = [];
      var searchMasus = [];

      Array.prototype.push.apply(searchMasus, this.reachingMasusWithKomaType('Gi'));
      Array.prototype.push.apply(searchMasus, this.reachingMasusWithKomaType('Ke'));
      Array.prototype.push.apply(searchMasus, this.reachingMasusWithKomaTypeMulti('Ka'));
      Array.prototype.push.apply(searchMasus, this.reachingMasusWithKomaTypeMulti('Hi'));
      searchMasus = searchMasus.filter(function (x, i, self) {
        return self.indexOf(x) === i;
      });

      searchMasus.forEach(function(masu) {
        var koma = masu.koma;
        if (!!koma && koma.isReach(this.masu)) komas.push(koma);
      }.bind(this));

      return komas;
    };

    this.isReach = function(masu) {
      return (this.reachingMasus().indexOf(masu) > -1);
    };

    this.reachingMasusWithKomaType = function(type) {
      var reachingMasus = [];
      reachVector(type).forEach(function(vector) {
        var targetMasuInfo = this.reachInfoWithVector(vector);
        if (!!targetMasuInfo.masu) reachingMasus.push(targetMasuInfo.masu)
      }.bind(this));
      return reachingMasus;
    };

    this.reachingMasusWithKomaTypeMulti = function(type) {
      var reachingMasus = [];
      reachVector(type).forEach(function(vector) {
        this.reachInfosWithMultiVector(vector).forEach(function(info) {
          reachingMasus.push(info.masu);
        });
      }.bind(this));
      return reachingMasus;
    };

    this.reachingMasus = function() {
      var reachingMasus = [];
      switch(this.type) {
        case 'Ky':
        case 'Ka':
        case 'Hi':
          Array.prototype.push.apply(reachingMasus, this.reachingMasusWithKomaTypeMulti(this.type));
          break;
        case 'NKa':
          Array.prototype.push.apply(reachingMasus, this.reachingMasusWithKomaTypeMulti('Ka'));
          Array.prototype.push.apply(reachingMasus, this.reachingMasusWithKomaType('Gy'));
          break;
        case 'NHi':
          Array.prototype.push.apply(reachingMasus, this.reachingMasusWithKomaTypeMulti('Hi'));
          Array.prototype.push.apply(reachingMasus, this.reachingMasusWithKomaType('Gy'));
          break;
        case 'NHu':
        case 'NKy':
        case 'NKe':
        case 'NGi':
          Array.prototype.push.apply(reachingMasus, this.reachingMasusWithKomaType('Ki'));
          break;
        default:
          Array.prototype.push.apply(reachingMasus, this.reachingMasusWithKomaType(this.type));
          break;
      }
      return reachingMasus.filter(function (x, i, self) {
        return self.indexOf(x) === i;
      });
    };

    this.reachInfoWithVector = function(vector) {
      var roleVectorY = (this.owner == 'white') ? -1 : 1;
      var roleVector = { x: vector.x, y: roleVectorY * vector.y };
      var targetCoodinate = mergedCoodinate(this.masu.coodinate, roleVector);
      if (0 <= targetCoodinate.x && targetCoodinate.x <= 8 && 0 <= targetCoodinate.y && targetCoodinate.y <= 8) {
        var targetMas = masus[targetCoodinate.x][targetCoodinate.y];
        if (!targetMas.koma) {
          return { masu: targetMas, isExistOpponent: false };
        } else if (this.owner != targetMas.koma.owner) {
          return { masu: targetMas, isExistOpponent: true };
        }
      }
          return { masu: null, isExistOpponent: false };
    };

    this.reachInfosWithMultiVector = function(vector) {
      var reachInfos = [];
      var multi_vector = vector;
      do {
        var reachInfo = this.reachInfoWithVector(multi_vector);
        if (!!reachInfo.masu) reachInfos.push(reachInfo);
        multi_vector = {x: multi_vector.x + vector.x, y: multi_vector.y + vector.y};
      }while (!!reachInfo.masu && !reachInfo.isExistOpponent);
      return reachInfos;
    };

    this.isAvoidableReaching = function() {
      var komas = this.komasReachingMe();
      if (komas.length == 0) {
        return true;
      } else if (komas.length == 1) {
        return this.isAvoidableReachingFrom(komas[0]);
      } else if (komas.length > 1) {
        return false;
      } else {
        throw new TypeError( reachingMasus + 'should return array, array count should be > 0' );
      }
    };

    this.isAvoidableReachingFrom = function(koma) {
      if (koma.komasReachingMe.length > 0) { // whether or not I can take koma reaching me
        return true;
      } else {
        var reachingMasus = this.reachingMasus();
        if (koma.type == 'ke') {
          return false;
        } else {
          console.log('moving: ' + this.isAvoidableReachingFromByMoving(koma));
          console.log('shield: ' + this.isAvoidableReachingFromByShield(koma));
          return ( this.isAvoidableReachingFromByMoving(koma) || this.isAvoidableReachingFromByShield(koma) );
        }
      }
    };

    this.isAvoidableReachingFromByMoving = function(koma) {
      this.reachingMasus().forEach(function(masu) {
        koma = new Koma({ type: this.type, owner: this.owner });
        koma.masu = masu;
        console.log('koma: ' + masu.coodinate.x + masu.coodinate.y + ' koma.reachingMe: ' + koma.komasReachingMe());
        if ( koma.komasReachingMe() > 0 ) {
          return false;
        }
      }.bind(this));
      return true;
    };

    this.isAvoidableReachingFromByShield = function(koma) {
      var traceCoodinate = {
        x: koma.masu.coodinate.x,
        y: koma.masu.coodinate.y
      };

      var subCoodinate = {
        x:  koma.masu.coodinate.x - this.masu.coodinate.x,
        y:  koma.masu.coodinate.y - this.masu.coodinate.y
      };

      var scalar = Math.min(Math.abs(subCoodinate.x), Math.abs(subCoodinate.y));
      var vector = {
        x: parseInt(- subCoodinate.x / scalar),
        y: parseInt(- subCoodinate.y / scalar)
      };

      console.log('scalar: ' + scalar);
      console.log('vector: ' + vector.x + ', ' + vector.y);

      reachingMasus = this.reachingMasus();
      do {
        traceCoodinate = {
          x: traceCoodinate.x + vector.x,
          y: traceCoodinate.y + vector.y
        }
        if (traceCoodinate != this.masu.coodinate) {
          console.log('traceCoodinate: ' + traceCoodinate.x + ', ' + traceCoodinate.y);
          var masu = masus[traceCoodinate.x][traceCoodinate.y];
          komas.forEach(function(koma) {
            if (koma.owner == this.owner) {
              if (koma.isReach(masu)) {
                if (koma != this) {
                  return true;
                } else {
                  koma = new Koma({ type: koma.type, owner: koma.owner });
                  koma.masu = masu;
                  if ( koma.komasReachingMe().length == 0 ) {
                    return true;
                  }
                }
              }
            }

          }.bind(this));
        }
      } while (traceCoodinate.x != this.masu.coodinate.x || traceCoodinate.y != this.masu.coodinate.y)
      return false;
    };
  }

  function Masu(coodinate) {
    var dom = document.createElement('div');
    dom.className = 'masu';
    this.dom = dom;
    this.coodinate = coodinate;
    this.koma = null;
    this.isReached = false;

    dom.onclick = function() {
      if (!isMyTurn) return;
      if (!this.koma) {
        if (this.isReached) {
          dereachAllMasus();
          var move = selectedKoma.move(this);
          saveToKifu(move);
          switchPhase();
        } else {
          dereachAllMasus();
        }
        selectedKoma = null;
      }
    }.bind(this);

    this.beReached = function() {
      this.dom.style.backgroundColor = 'red';
      this.isReached = true;
      reachingMasuCoodinates.push(this.coodinate);
    };

    this.beDereached = function() {
      this.dom.style.backgroundColor = '';
      this.isReached = false;
      reachingMasuCoodinates = reachingMasuCoodinates.filter(function(v, i) {
        return (v !== this.coodinate);
      }.bind(this));
    };
  }

  function Komadai(params) {
    this.owner = params;
    var dom = document.createElement('div');
    dom.className = 'komadai';
    if (params == 'black') {
      dom.style.bottom = 0;
    } else {
      dom.style.top = 0;
    }
    this.dom = dom;
  }

  // ------ init ------

  (function init() {
    var field = document.createElement('div');
    field.className = 'field';
    document.body.appendChild(field);

    (function initLeft() {
      var left = document.createElement('div');
      left.className = 'side';
      whiteKomadai = new Komadai('white');
      left.appendChild(whiteKomadai.dom);
      field.appendChild(left);
    })();

    (function initCenter() {
      var ban = new Ban();
      field.appendChild(ban.dom);

      (function initMasu() {
        for (var x = 0; x < 9; x++) {
          var columnMasus = [];
          var columnList = document.createElement('div');
          columnList.style.float = 'right';
          for (var y = 0; y < 9; y++) {
            var masu = new Masu({x: x, y: y});
            columnMasus.push(masu);
            columnList.appendChild(masu.dom);
          }
          masus.push(columnMasus);
          ban.dom.appendChild(columnList);
        }
      })();

      (function initKoma() {
        for (var x = 0; x < 9; x++) {
          for (var y = 0; y < 9; y++) {
            var owner = y > 3 ? 'black' : 'white';
            var type = null;
            if (y == 2 || y == 6) { type = 'Hu'; }
            else if (y == 0 || y == 8) {
              if (x == 0 || x == 8) { type = 'Ky'; }
              else if (x == 1 || x == 7) { type = 'Ke'; }
              else if (x == 2 || x == 6) { type = 'Gi'; }
              else if (x == 3 || x == 5) { type = 'Ki'; }
              else if (x == 4) { type = 'Gy'; }
            }
            else if ((y == 1 && x == 1) || (y == 7 && x == 7)) { type = 'Ka'; }
            else if ((y == 1 && x == 7) || (y == 7 && x == 1)) { type = 'Hi'; }
            if (!!type) {
              koma = new Koma({ type: type, owner: owner });
              komas.push(koma);
              masu = masus[x][y];
              koma.move(masu);
            }
          }
        }
      })();
    })();

    (function initRight() {
      var right = document.createElement('div');
      right.className = 'side';
      blackKomadai = new Komadai('black');
      right.appendChild(blackKomadai.dom);
      field.appendChild(right);
    })();
  })();

  var kifuStr = location.search.slice(1);
  console.log('kifuStr: ' + kifuStr);
  if( kifuStr.length > 0) {
    var moveStrs = kifuStr.match(new RegExp(".{1,"+2+"}","g"));
    moveStrs.forEach(function(moveStr, idx) {
      var int = convertUrlStrToNum(moveStr.slice(0, 1)) * 69 + convertUrlStrToNum(moveStr.slice(1));
      owner = idx % 2 == 0 ? 'black' : 'white';
      console.log(moveStr + ', ' + int + ', ' + convertIntAndOwnerToMoveStr(int, owner));
    });
  }
})();
