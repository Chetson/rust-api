<?php

namespace App\Enums\Transaction;

class StatusEnum
{
    public const CREATED = 'CREATED';
    public const WAITING = 'WAITING';
    public const FAILED = 'FAILED';
    public const CANCELED = 'CANCELED';
    public const CONFIRMED = 'CONFIRMED';
}
