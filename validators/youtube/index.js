export const isUrlAvailable= (ctx)=>{
let err = null;
const { URL } = ctx.query;
if (!URL) {
  err={message : "Missing URL parameter", fieldname : "URL"} ;
  return err;
}
if(ctx.state.shared)
ctx.state.shared.URL =URL;
else 
ctx.state = {
    shared: {
      URL,
    },
  }
return err;
}

export const isUrlValid = (ctx)=>{
    
let err = null;
    if(!ctx.state.shared)
    {
    return err;
    }
        const { URL } = ctx.state.shared
        const videoId = extractVideoId(URL);
        console.log("video ID", videoId);
        if (!videoId) {
            err = { message : "Invalid YouTube URL", fieldname : "URL"}
            return err;
        }
        function extractVideoId(url) {
            var regExpRegularVideo =
                /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var regExpShortsVideo =
                /^.*(youtu.be\/shorts\/|youtube.com\/shorts\/)([^#\&\?]*).*/;
            var matchRegular = url.match(regExpRegularVideo);
            var matchShorts = url.match(regExpShortsVideo);
        
            if (matchRegular && matchRegular[2].length == 11) {
                return matchRegular[2];
            } else if (matchShorts && matchShorts[2].length == 11) {
                return matchShorts[2];
            }
            return null;
        }
        ctx.state.shared.videoId =videoId;
    
 return err;       
}