import functools
import time


# ---------- LOGGING DECORATOR ----------
def log_call(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        print(f"\n▶ Calling {func.__name__}")

        try:
            result = func(*args, **kwargs)
            duration = round(time.time() - start, 2)
            print(f"✅ {func.__name__} succeeded in {duration}s")
            return result

        except Exception as e:
            duration = round(time.time() - start, 2)
            print(f"❌ {func.__name__} failed in {duration}s | Error: {e}")
            raise

    return wrapper


# ---------- RETRY DECORATOR ----------
def retry(times=3, delay=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):

            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)

                except Exception as e:
                    print(f"⚠ Attempt {attempt}/{times} failed: {e}")

                    if attempt == times:
                        print("❌ All retry attempts failed")
                        raise

                    time.sleep(delay)

        return wrapper
    return decorator