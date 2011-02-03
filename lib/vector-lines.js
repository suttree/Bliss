// From http://bytes.com/topic/javascript/answers/88771-drawing-vector-lines-javascript
function DrawLinHor(x, y, size, color){
  var str;
  if (x>=0 && y>=0 && size>0){
    str = '<div style="position:absolute; left:' + x + 'px; top:' + y + 'px; width:' + size + 'px; height:1px; background-color:' + color + '"><table height=1 width=' + size + '></table></div>\n';
  } else {
    str = '';
  }
  $('#players').append(str);
}

function DrawLinVert(x, y, size, color){
  var str;
  if (x>=0 && y>=0 && size>0){
    str = '<div style="position:absolute; left:' + x + 'px; top:' + y + 'px; width:1px; height:' + size + 'px; background-color:' + color + '"><table height=' + size + ' width=1></table></div>\n';
  } else {
    str = '';
  }
  $('#players').append(str);
}

function DrawLine( x1, y1, x2, y2, color ){
  deltax=Math.abs(x2-x1);
  deltay=Math.abs(y2-y1);
  if (deltax>=deltay) {
    if (y2<y1) {
      help=x1;
      x1=x2;
      x2=help;
      help=y1;
      y1=y2;
      y2=help;
    }

    deltax=x2-x1;
    deltay=y2-y1;
    dstep=deltax/(deltay+1);

    x=x1;
    if (dstep<0){
      x=x+dstep;
    }

    for (y=y1;y<=y2;y++){
      size=((x+dstep)-(x));
      if (dstep<0) {
        DrawLinHor( (x)-(dstep)+(size),(y),Math.abs(size),color );
      } else {
        DrawLinHor( (x),(y),Math.abs(size),color );
      }
      x=x+dstep;
    }
  } else {
    if (x2<x1) {
      help=x1;
      x1=x2;
      x2=help;
      help=y1;
      y1=y2;
      y2=help;
    }

    deltax=x2-x1;
    deltay=y2-y1;
    dstep=deltay/(deltax+1);

    y=y1;
    if (dstep<0){
      y=y+dstep;
    }

    for (x=x1;x<=x2;x++){
      size=((y+dstep)-(y))
      if (dstep<0){
        DrawLinVert( (x),(y)-(dstep)+(size),Math.abs(size),color );
      } else {
        DrawLinVert( (x),(y),Math.abs(size),color );
      }
      y=y+dstep;
    }
  }
}
