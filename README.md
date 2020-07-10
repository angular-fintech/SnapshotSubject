# SnapshotSubject

# Collection of RXJS Utilities

## SnapshotReplaySubject

RX JS Subject keep tracks of objects based on keys
New Subscriber will get snapshot of accumulated messages and then updates

In Financial Market data applications e.g. we want to display market data 
based on some key

const sub = new SnapShotReplaySubject<any>((value) => {return value.key});


sub.next({key:'IBM', bid:100, ask:101}); 
sub.next({key:'IBM', bid:102, ask:104});


 sub.subscribe((val) => {
     console.log(value);
    } );
  }

will display only

{key:'IBM', bid:102, ask:104}
