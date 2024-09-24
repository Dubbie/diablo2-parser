<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class CreateItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'item_id' => 'required|exists:items,id',
            'modifiers' => 'required|array',
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                // Check range is ok
                $modifiers = $validator->getData()['modifiers'];

                foreach ($modifiers as $i => $modifier) {
                    if (!array_key_exists('min', $modifier) || !array_key_exists('max', $modifier)) {
                        continue;
                    }

                    $value = $modifier['values'][0];
                    if ($value < $modifier['min'] || $value > $modifier['max']) {
                        $validator
                            ->errors()
                            ->add("modifiers.{$i}", 'Value must be between ' . $modifier['min'] . ' and ' . $modifier['max']);
                    }
                }
            }
        ];
    }
}
