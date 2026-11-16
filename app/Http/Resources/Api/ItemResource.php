<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class ItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'property_id' => $this->id,
            'type' => $this->type->slug,
            'icon' => $this->type->slug == "command" ? 'https://'.$_SERVER['HTTP_HOST'].'/storage/'.$this->product[$this->type->slug]->icon : null,
            'amount' => $this->product->amount,
            'command' => $this->product->command ? $this->product->command->comma : null,
            'shortname' => $this->type->slug == "item" ? $this->product->item->uniqname : null,
            'blocked' => $this->product->blocked_until ? (new Carbon($this->product->blocked_until))->format('m/d/Y H:i:s') : null,
        ];
    }
}
