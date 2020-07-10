import {Subject, Subscriber, Subscription} from "rxjs";
import {SubjectSubscription} from "rxjs/internal/SubjectSubscription";
import {ObjectUnsubscribedError} from "rxjs/internal/util/ObjectUnsubscribedError";

export class SnapShotReplaySubject<T> extends Subject<T>{


    private _snapshot = new Map<any, T>()


    /**
     *
     * A Lambda that takes original value and returns key for that value
     * @param keyMapper
     */
    constructor(private keyMapper: (value: T) => any) {
        super();
        this.next = this.myNext;
    }

    public snapshot(): Array<T> {
        return Array.from(this._snapshot.values());
    }

    private myNext(value:T): void  {

        const k = this.keyMapper(value);
        const _snapshot = this._snapshot;
        _snapshot.set(k, value);

        super.next(value);

    }


    _subscribe(subscriber: Subscriber<T>): Subscription {

        const snapshot = this._snapshot;
        let subscription: Subscription;

        if(this.closed){
            throw new ObjectUnsubscribedError();
        }else  if(this.isStopped || this.hasError){
            subscription = Subscription.EMPTY;
        }else {
            this.observers.push(subscriber);
            subscription = new SubjectSubscription(this,subscriber);
        }

        snapshot.forEach(value => {
           if(!subscriber.closed){
               subscriber.next(value);
           }
        });

        if(this.hasError){
            subscriber.error(this.thrownError);
        }else if (this.isStopped){
            subscriber.complete();
        }

        return subscription;

    }


}