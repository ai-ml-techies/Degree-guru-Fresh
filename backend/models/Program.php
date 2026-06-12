<?php

declare(strict_types=1);

namespace app\models;

use yii\db\ActiveRecord;

/**
 * @property int    $id
 * @property string $slug
 * @property string $name
 * @property string $full_name
 * @property string $level
 * @property string $desc
 * @property string $tagline
 * @property string $about
 * @property string $enroll_for   JSON column
 * @property string $emi_note
 * @property string $career_roles JSON column
 * @property string $career_salary
 * @property int    $sort_order
 * @property int    $is_active
 * @property string|null $meta_title
 * @property string|null $meta_desc
 * @property string|null $og_image
 * @property string|null $focus_keyword
 */
class Program extends ActiveRecord
{
    public static function tableName(): string
    {
        return 'programs';
    }

    public function rules(): array
    {
        return [
            [['slug', 'name', 'level'], 'required'],
            [['slug'], 'match', 'pattern' => '/^[a-z0-9\-]+$/', 'message' => 'Slug may only contain lowercase letters, numbers and hyphens.'],
            [['slug'], 'unique'],
            [['level'], 'in', 'range' => ['Bachelors', 'Masters', 'Doctoral', 'Skills']],
            [['name', 'full_name', 'tagline', 'career_salary'], 'string', 'max' => 500],
            [['slug'], 'string', 'max' => 100],
            [['desc', 'about', 'emi_note'], 'string'],
            [['sort_order'], 'integer'],
            [['is_active'], 'boolean'],
            [['enroll_for', 'career_roles'], 'safe'],
            [['meta_title'], 'string', 'max' => 70],
            [['meta_desc'], 'string', 'max' => 160],
            [['og_image'], 'string', 'max' => 500],
            [['focus_keyword'], 'string', 'max' => 100],
            [['meta_title', 'meta_desc', 'og_image', 'focus_keyword'], 'default', 'value' => null],
        ];
    }

    public function attributeLabels(): array
    {
        return [
            'slug'          => 'URL Slug',
            'name'          => 'Short Name',
            'full_name'     => 'Full Degree Name',
            'level'         => 'Level',
            'desc'          => 'Card Description',
            'tagline'       => 'Hero Tagline',
            'about'         => 'About (Long Description)',
            'enroll_for'    => 'Who Should Enroll (one per line)',
            'emi_note'      => 'EMI Note',
            'career_roles'  => 'Career Roles (one per line)',
            'career_salary' => 'Average Salary Range',
            'sort_order'     => 'Sort Order',
            'is_active'      => 'Active',
            'meta_title'     => 'SEO Title',
            'meta_desc'      => 'Meta Description',
            'og_image'       => 'OG Image URL',
            'focus_keyword'  => 'Focus Keyword',
        ];
    }

    // ─── Helpers for JSON columns ──────────────────────────────────────────────

    public function getEnrollForArray(): array
    {
        $raw = $this->enroll_for;
        if (empty($raw)) return [];
        $decoded = is_array($raw) ? $raw : json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function getCareerRolesArray(): array
    {
        $raw = $this->career_roles;
        if (empty($raw)) return [];
        $decoded = is_array($raw) ? $raw : json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    /** Convert textarea (one item per line) → JSON string for saving. */
    public static function linesToJson(string $text): string
    {
        $lines = array_values(array_filter(array_map('trim', explode("\n", $text))));
        return json_encode($lines, JSON_UNESCAPED_UNICODE);
    }

    /** Convert JSON array → textarea string (one item per line). */
    public static function jsonToLines(string $json): string
    {
        $arr = json_decode($json, true);
        return is_array($arr) ? implode("\n", $arr) : '';
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public static function findActive(): \yii\db\ActiveQuery
    {
        return static::find()->where(['is_active' => 1])->orderBy(['sort_order' => SORT_ASC, 'id' => SORT_ASC]);
    }
}
