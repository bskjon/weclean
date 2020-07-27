function weclean()
{
    var rf = $("#subscription-table").children();
    var it = rf.find("a");
    var list = [];
    var i = 0;
    var cancelRun = false;

    this.cancel = function()
    {
        cancelRun = true;
        console.info("Run will abort when reaching checkpoint");
    }

    for (var x = 0; x < it.length; x++)
    {
        if (it[x].text.indexOf(" ") > -1)
        {
            list.push(it[x]);
        }
    }
    console.info(list);

    this.wait = function(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
          end = new Date().getTime();
       }
    }

    this.run = function()
    {
        cancelRun = false;
        if (i != 0)
        {
            console.error("Clean is running");
            return;
        }

        console.info("Each deletion is going to take about 7 sec");        
        if (list.length > 0)
        {
            exec();
        }
        else
        {
            console.info("No items found..");
        }
        
    }


    function exec()
    {
        if (i == list.length-1)
        {
            console.info("Done!");
            return;
        }

        var active = list[i];
        console.info("Selecting " + active.text);
        active.click();

        // Waiting in hope for the web interface to update
        setTimeout(function()
        {
            i++;
            if (cancelRun)
            {
                console.info("Abort registered!");
                return;
            }

            var rcCallRes =  rcmail.command('delete-folder','', active.text,event)

            var delbtn = $("button.mainaction.delete.btn.btn-primary.btn-danger");
            
            
            setTimeout(function()
            {
                if (cancelRun)
                {
                    console.info("Abort registered!");
                    return;
                }

                var folderFrame = $("#preferences-frame");

                var msgCount = $(folderFrame).contents().find("td.col-sm-8.form-control-plaintext")[0];
                if (msgCount != null && msgCount.innerText == "0")
                {
                    console.info("No messages in folder");
                }
                else
                {
                    console.info("Messages found! Skipping folder");
                    exec();
                    return;
                }

                setTimeout(function()
                {
                    delbtn.css({"background": "#00a8e6"});

                    delbtn.click();

                    setTimeout(function()
                    {
                        exec();
                    }, 1500);
                }, 1500);
            }, 1500);

        },
        3500);
    }
}

var wc = new weclean();
wc.run();
