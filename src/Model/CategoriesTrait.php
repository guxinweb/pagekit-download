<?php

namespace Bixie\Download\Model;


/**
 * Class CategoriesTrait
 * @package Bixie\Download\Model
 */
trait CategoriesTrait
{

	/**
	 * @ManyToMany(
	 *            targetEntity="Category",
	 *            tableThrough="@download_files_categories",
	 *            keyThroughFrom="file_id",
	 *            keyThroughTo="category_id"
	 * )
	 * @var Category[]
	 */
	public $categories;

	/**
	 * @var integer
	 */
	protected $activeCategoryId;

	/**
	 * @param $category_id
	 */
	public function setActiveCategory ($category_id) {
		$this->activeCategoryId = $category_id;
	}

	/**
	 * @return null|Category
	 */
	public function getActiveCategory () {
		if (!$this->categories || !isset($this->categories[$this->activeCategoryId ? : $this->get('primary_category', 0)])) {
			return null;
		}
		return $this->categories[$this->activeCategoryId ? : $this->get('primary_category', 0)];
	}

	/**
	 * @return array
	 */
	public function getCategoryIds () {
		if ($this->categories) {
			return array_values(array_map(function ($category) {
				return $category->id;
			}, $this->categories));
		}
		return [];
	}

	/**
	 * @return array
	 */
	public function getCategoryTitles () {
		if ($this->categories) {
			return array_values(array_map(function ($category) {
				return $category->title;
			}, $this->categories));
		}
		return [];
	}

	/**
	 * @param Category $category
	 */
	public function addCategory (Category $category) {
		$this->categories[$category->id] = $category;
	}

	/**
	 * @param Category $category
	 */
	public function removeCategory (Category $category) {
		unset($this->categories[$category->id]);
	}

	/**
	 * @param array $category_ids
	 */
	public function saveCategories (array $category_ids) {
		$remove = array_diff(array_keys(($this->categories ? : [])), $category_ids);
		foreach ($remove as $category_id) {
			if ($xref = FilesCategories::where(['file_id' => $this->id, 'category_id' => $category_id])->first()) {
				$this->removeCategory($this->categories[$category_id]);
				$xref->delete();
			}
		}
		foreach ($category_ids as $category_id) {
			if (!in_array($category_id, $remove) && !isset($this->categories[$category_id])) {
				if ($category = Category::find($category_id)) {
					$this->addCategory($category);
					$xref = FilesCategories::create(['file_id' => $this->id, 'category_id' => $category->id]);
					$xref->save();
				}
			}
		}
	}

	/**
	 * Load the category objects
	 */
	public function loadCategories () {
		if ($xrefs = FilesCategories::where(['file_id' => $this->id])->get()) {
			foreach (array_keys($xrefs) as $category_id) { //loop to use the cache in Category::find
				if ($category = Category::find($category_id)) {
					$this->addCategory($category);
				}
			}
		}
	}
}
