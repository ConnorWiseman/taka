'use strict';


/**
 * Exports a constructor for a simple rate limiter object. Used to monitor
 * a series of repeated actions, expressed as limit per interval.
 * Put another way: actions per second.
 * @arg {number} limit    - The number of actions to monitor.
 * @arg {number} interval - The time interval to monitor, in seconds.
 * @readonly
 */
module.exports = function(limit, interval) {
    // Set some essential properties.
    this.limit = limit;
    this.interval = interval;
    this.allowance = this.limit;
    this.warnCount = 0;
    this.warnLimit = 3;


    /**
     * Generates a new timestamp in seconds.
     * @readonly
     */
    this.getTimestamp = function() {
        return Date.now() / 1000;
    };


    // Create a new timestamp for the current time.
    this.lastChecked = this.getTimestamp();


    /**
     * Updates the rate limiter's allowance property depending on the time passed since
     * the time it was last checked.
     * @readonly
     */
    this.update = function() {
        // Generate a timestamp for the current time and calculate the difference between now and the last checked date.
        var currentTime = this.getTimestamp(),
            timePassed = currentTime - this.lastChecked;

        // Update the last checked date.
        this.lastChecked = this.getTimestamp();

        // Increase the allowance amount some.
        this.allowance += (timePassed * (this.limit / this.interval));

        // Throttle the . Without this, clients could connect, wait a lengthy period of time, and then spam freely.
        if (this.allowance > this.limit) {
            this.allowance = this.limit;
        }
    };


    /**
     * Returns true if the rate limiter's limit has been exceeded.
     * @readonly
     */
    this.spamWarning = function() {
        if (this.allowance < 1.0) {
            this.warnCount++;
            return true;
        }
        return (this.allowance < 1.0);
    };


    /**
     * Returns true if the warn limit has been exceeded.
     * @readonly
     */
    this.spamDetected = function() {
        return (this.allowance < 1.0 && this.warnCount >= (this.warnLimit + 1));
    };


    /**
     * Decreases the rate limiter's allowance property.
     * @readonly
     */
    this.decrease = function() {
        this.allowance -= 1.0;
    };
};