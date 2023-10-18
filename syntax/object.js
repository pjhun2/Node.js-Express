var members = ["A","B","C"]
var i=0;
while(i < members.length) {
    console.log(members[i])
    i+=1
}

var roles = {
    'program' : 'toss',
    'designer' : 'hoya',
    'vip':'pjh'
}

console.log(roles.designer)

for(var name in roles) {
    console.log(name)
    console.log(roles[name])
}
