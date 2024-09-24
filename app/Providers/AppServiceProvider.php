<?php

namespace App\Providers;

use App\Factories\PropertyHandlerFactory;
use App\Factories\StatFunctionHandlerFactory;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(PropertyHandlerFactory::class, function ($app) {
            return new PropertyHandlerFactory($app);
        });

        $this->app->bind(StatFunctionHandlerFactory::class, function ($app) {
            return new StatFunctionHandlerFactory($app);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
