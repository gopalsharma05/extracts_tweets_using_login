
 				 function Last7Days () {
                var result = [];
                for (var i=0; i<7; i++) {
                    var d = new Date();
                    d.setDate(d.getDate() - i);
                    result[i]=d;
                }

                return(result.join(','));

                 
            }

 				var days= Last7Days();
 			   days=","+days;
              var str=[];
              var j=0;
              for(var i=0;i<days.length;i++)
              {
                if(days[i]==',')
                {
                    str[j]=days.substring(i+1,i+16);
                    j++;
                }
              }

              function checkdate(dt)
              {
              		  for(var i=0;i<str.length;i++)
              			{
              				if(str[i]==dt)
              				return true;
              			}

              			return false;
              }

              module.exports={
              checkdate
              }

                