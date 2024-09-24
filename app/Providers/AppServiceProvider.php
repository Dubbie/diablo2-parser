<?php

namespace App\Providers;

use App\Factories\CustomDescriptionHandlerFactory;
use App\Factories\DescriptionFunctionHandlerFactory;
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

        $this->app->bind(DescriptionFunctionHandlerFactory::class, function ($app) {
            return new DescriptionFunctionHandlerFactory($app);
        });

        $this->app->bind(CustomDescriptionHandlerFactory::class, function ($app) {
            return new CustomDescriptionHandlerFactory($app);
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
