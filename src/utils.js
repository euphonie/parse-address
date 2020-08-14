let invert = (o) => {
  var o1= {};
  keys(o).forEach(function(k){
    o1[o[k]] = k;
  });
  return o1;
}
let flatten = (o) => {
  return keys(o).concat(values(o));
}

let values = (o) => {
  var v = [];
  keys(o).forEach(function(k){
    v.push(o[k]);
  });
  return v;
}

let each = (o,fn) => {
  keys(o).forEach(function(k){
    fn(o[k],k);
  });
}

let keys = (o) => {
  return Object.keys(o);
};

let capitalize = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

export default {
  invert,
  flatten,
  values,
  each,
  keys,
  capitalize
};
